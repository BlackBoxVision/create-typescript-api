import PropTypes from 'prop-types';
import {h, Component} from 'ink';

export default class Conditional extends Component {
    static propTypes = {
        expression: PropTypes.bool,
        children: PropTypes.array
    }

    render(props) {
        if (props.expression) {
            return props.children;
        }

        return null;
    }
}