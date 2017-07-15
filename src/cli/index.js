import { h, Component, Text } from 'ink';
import TextInput from 'ink-text-input';
import readLine from 'readline';

import Conditional from './components/Conditional';
import Container from './components/Container';
import FileUtils from './util/File';
import ZipUtils from './util/Zip';

export default class Cli extends Component {
    state = {
        query: '',
        progress: 0,
        error: null,
        result: null,
        projectName: null
    };

    componentDidMount() {
        readLine.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
    }

    render(props, state) {
        return (
            <Container>
                <Conditional expression={state.query.length >= 0 && !state.result}>
                    <Text green>Insert your project name:</Text>
                    <br />
                    <TextInput value={state.query} onChange={this.handleChange} onSubmit={this.handleSubmit} />
                </Conditional>
                <Conditional expression={state.error}>
                    <Text red>
                        {state.error}
                    </Text>
                </Conditional>
                <Conditional expression={state.result === 'ok'}>
                    <Text green>
                        {state.projectName} has been created.
                    </Text>
                </Conditional>
            </Container>
        );
    }

    handleChange = value =>
        this.setState(state => ({
            query: value
        }));

    handleSubmit = async path => {
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
    };
}
