import { h, Component, Text } from 'ink';
import Progress from 'ink-progress-bar';
import PropTypes from 'prop-types';
import Spinner from 'ink-spinner';
import readLine from 'readline';

import Conditional from './components/Conditional';
import Container from './components/Container';
import FileUtils from './util/File';
import ZipUtils from './util/Zip';

const Types = {
    EXIT_WITH_SUCCESS: 0,
    EXIT_WITH_ERROR: 1
};

export default class Cli extends Component {
    static propTypes = {
        projectName: PropTypes.string.isRequired
    };

    static defaultProps = {
        projectName: 'test'
    };

    state = {
        error: null,
        result: null,
        projectName: null
    };

    async componentDidMount() {
        readLine.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        await this.createScaffold(this.props.projectName);
    }

    render(props, state) {
        //TODO Review
        //<Progress character="=" left={0} right={0} green />

        return (
            <Container>
                <Conditional expression={!state.error && !state.result}>
                    <Spinner green /> Fetching base project from GitHub.
                </Conditional>
                <Conditional expression={state.error !== null}>
                    <Text red>{state.error && state.error.message}</Text>
                </Conditional>
                <Conditional expression={state.result === 'ok'}>
                    <Text green>
                        Project {state.projectName} has been created successfully.
                    </Text>
                </Conditional>
            </Container>
        );
    }

    createScaffold = async path => {
        const gitHubFolderName = 'typescript-hapi-starter-master';

        try {
            const stream = await ZipUtils.download(
                'https://github.com/BlackBoxVision/typescript-hapi-starter/archive/master.zip'
            );

            await ZipUtils.writeStream(stream, path);

            if (await FileUtils.exists(path)) {
                await this.handleError(`${path}.zip`, new Error('File already exists'));
            } else {
                await ZipUtils.extract(path);

                await FileUtils.remove(`${path}.zip`);
                await FileUtils.renameFolder(gitHubFolderName, path);

                this.setState(state => ({
                    projectName: path,
                    result: 'ok'
                }));

                this.exitWithDelay(Types.EXIT_WITH_SUCCESS);
            }
        } catch (error) {
            await this.handleError(gitHubFolderName, error);
        }
    };

    handleError = async (path, error) => {
        await FileUtils.remove(path);

        this.setState(state => ({
            error: error
        }));

        this.exitWithDelay(Types.EXIT_WITH_ERROR);
    };

    exitWithDelay = (type, delay = 1000) => setTimeout(() => process.exit(type), delay);
}
