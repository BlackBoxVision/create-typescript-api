import { h, Component, Text } from 'ink';
import PropTypes from 'prop-types';
import Spinner from 'ink-spinner';
import readLine from 'readline';

import Conditional from './components/Conditional';
import Container from './components/Container';
import FileUtils from './util/File';
import ZipUtils from './util/Zip';

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
        return (
            <Container>
                <Conditional expression={!state.error && !state.result}>
                    <Spinner green /> Fetching base project from GitHub.
                </Conditional>
                <Conditional expression={state.error}>
                    <Text red>
                        {state.error}
                    </Text>
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
        try {
            const gitHubUrl = 'https://github.com/BlackBoxVision/typescript-hapi-starter/archive/master.zip';
            const gitHubFolderName = 'typescript-hapi-starter-master';

            const stream = await ZipUtils.download(gitHubUrl);

            await ZipUtils.writeStream(stream, path);
            await ZipUtils.extract(path);
            await ZipUtils.remove(path);

            await FileUtils.renameFolder(gitHubFolderName, path);

            this.setState(state => ({
                projectName: path,
                result: 'ok'
            }));
        } catch (error) {
            this.setState(state => ({
                error: error
            }));
        }

        setTimeout(() => process.exit(0), 1000);
    };
}
