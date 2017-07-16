import { h, Component, Text } from 'ink';
//import Progress from 'ink-progress-bar';
import PropTypes from 'prop-types';
import Spinner from 'ink-spinner';
import readLine from 'readline';

import FileUtils from './util/File';
import ZipUtils from './util/Zip';

import Cli from './components';

const Types = {
    EXIT_WITH_SUCCESS: 0,
    EXIT_WITH_ERROR: 1
};

export default class Command extends Component {
    static propTypes = {
        projectName: PropTypes.string.isRequired
    };

    static defaultProps = {
        projectName: 'test'
    };

    state = {
        error: null,
        result: null,
        projectName: null,
        progress: false
    };

    async componentDidMount() {
        await this.enableKeyPress();
        await this.createScaffold(this.props.projectName);
    }

    render(props, state) {
        const isFetchingFromGitHub = !state.error && !state.result && !state.progress;
        const isInProgress = state.progress;
        const hasErrors = state.error !== null;
        const hasResults = state.result === 'ok';

        const projectName = state.projectName || props.projectName;

        //TODO Review If we can use progress
        //<Progress character="=" left={0} right={0} green />

        return (
            <Cli.Container>
                <Cli.Conditional expression={isFetchingFromGitHub}>
                    <Spinner green /> Fetching base project from GitHub.
                </Cli.Conditional>
                <Cli.Conditional expression={isInProgress}>
                    <Spinner green /> Unzipping starter project to {projectName}
                </Cli.Conditional>
                <Cli.Conditional expression={hasErrors}>
                    <Text red>
                        {state.error && state.error.message}
                    </Text>
                </Cli.Conditional>
                <Cli.Conditional expression={hasResults}>
                    <Text green>
                        Project {projectName} has been created successfully.
                    </Text>
                </Cli.Conditional>
            </Cli.Container>
        );
    }

    createScaffold = async path => {
        const gitHubUrl = 'https://github.com/BlackBoxVision/typescript-hapi-starter/archive/master.zip';
        const gitHubFolderName = 'typescript-hapi-starter-master';

        try {
            const stream = await ZipUtils.download(gitHubUrl);

            await ZipUtils.writeStream(stream, path, progress => {
                //console.info('Progress', JSON.stringify(progress, null, 2));

                this.setState(state => ({
                    progress: true
                }));
            });

            if (await FileUtils.exists(path)) {
                await this.handleError(
                    `${path}.zip`,
                    new Error(`Directory ${path} already exists. Please, retry with another <project-name>.`)
                );
            } else {
                await ZipUtils.extract(path);

                await FileUtils.remove(`${path}.zip`);
                await FileUtils.renameFolder(gitHubFolderName, path);

                this.setState(state => ({
                    projectName: path,
                    progress: false,
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
            progress: false,
            error: error
        }));

        this.exitWithDelay(Types.EXIT_WITH_ERROR);
    };

    exitWithDelay = (type, delay = 1000) => setTimeout(() => process.exit(type), delay);

    enableKeyPress = () =>
        new Promise(resolve => {
            readLine.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);

            resolve();
        });
}
