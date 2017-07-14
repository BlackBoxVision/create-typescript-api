import {h, mount, Component, Text} from 'ink';

class Counter extends Component {
    constructor() {
        super();
        this.state = {
            index: 0
        };
    }

    componentDidMount() {
        this.timer = this.createIntervalUpdater();
    }

    render(props, state) {
        return (
            <Text green>
                {state.index} tests passed
            </Text>
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    createIntervalUpdater = () => setInterval(() => this.setState({ index: this.state.index + 1 }), 100);
}

mount(<Counter/>, process.stdout);