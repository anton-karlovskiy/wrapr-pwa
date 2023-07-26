
import { Component } from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../../../actions/authentication';

class Logout extends Component {
    componentDidMount() {
        const { logoutUser } = this.props;
        logoutUser(this.props.history);
    }

    render() {
        return null;
    }
}

const mapActionToProps = {
    logoutUser: logoutUser
};

export default connect(null, mapActionToProps)(Logout);
