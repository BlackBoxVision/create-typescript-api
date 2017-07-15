import PropTypes from 'prop-types';
import { h, Component } from 'ink';

export default class Container extends Component {
    static propTypes = {
        children: PropTypes.array
    };

    render(props) {
        return (
            <div>
                {props.children}
            </div>
        );
    }
}
