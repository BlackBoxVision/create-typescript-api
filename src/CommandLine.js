import {h, Component, Text} from 'ink';
import TextInput from 'ink-text-input';
import fetch from 'isomorphic-fetch';
import readLine from 'readline';
import fs from 'fs';

import Conditional from './components/Conditional';

export default class CommandLine extends Component {
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
            <div>
                <Conditional expression={state.query.length >= 0 && !state.result}>
                    <Text green>
                        Please, insert your project name:
                    </Text>
                    <br/>
                    <TextInput
                        value={state.query}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                    />
                </Conditional>
                <Conditional expression={state.error}>
                    <Text red>
                        {state.error}
                    </Text>
                </Conditional>
                <Conditional expression={state.result}>
                    <Text green>
                        {state.projectName}.zip has been created.
                    </Text>
                </Conditional>
            </div>
        );
    }

    handleChange = value => this.setState(state => ({
        query: value
    }));

    handleSubmit = async value => {
        try {
            const stream = await this.fetchRepository('BlackBoxVision', 'typescript-hapi-starter');
            const result = await this.writeData(stream, value);

            if (result) {
                this.setState(state => ({
                    projectName: value,
                    result: result
                }));
            }

        } catch (error) {
            this.setState(state => ({
                error: error
            }));
        }
    }

    fetchRepository = async (organization, repository) => {
        const response = await fetch(`https://github.com/${organization}/${repository}/archive/master.zip`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'application/zip'
            }
        });

        return response.body;
    }

    writeData = (stream, value) => {
        return new Promise((resolve, reject) => {
            stream.pipe(fs.createWriteStream(`${value}.zip`))
                .on('error', error => reject(error))
                .on('close', () => resolve('file written'));
        });
    }
}