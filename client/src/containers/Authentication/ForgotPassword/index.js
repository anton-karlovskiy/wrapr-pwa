
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from '@material-ui/core/Link';

import { sendResetEmail, clearAuthErrors } from '../../../actions/authentication';
import { getSpacingUnit } from '../../../utils/utility';
import { pageLinks } from '../../../utils/links';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        main: {
            width: 'auto',
            display: 'block', // Fix IE 11 issue
            marginLeft: spacingUnit * 3,
            marginRight: spacingUnit * 3,
            [theme.breakpoints.up(400 + spacingUnit * 3 * 2)]: {
                width: 400,
                marginLeft: 'auto',
                marginRight: 'auto'
            }
        },
        paper: {
            marginTop: spacingUnit * 8,
            marginBottom: spacingUnit * 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${spacingUnit * 2}px ${spacingUnit * 3}px ${spacingUnit * 3}px `
        },
        avatar: {
            margin: spacingUnit,
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '100%', // Fix IE 11 issue
            marginTop: spacingUnit
        },
        submit: {
            marginTop: spacingUnit * 3
        },
        signIn: {
            width: '100%',
            padding: spacingUnit * 2
        }
    };
};

class ForgotPassword extends Component {
    state = {
        email: '',
        sentEmailMessage: '',
        loading: false
    };

    componentDidMount() {
        clearAuthErrors();
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const resetUrl = `${window.location.host}${pageLinks.ResetPassword.url}`;
        const data = {
            email: this.state.email,
            resetUrl
        };

        this.setState({sentEmailMessage: '', loading: true});
        const successCallback = response => {
            const { data: { message } } = response;
            this.setState({sentEmailMessage: message, loading: false});
        };
        const errorCallback = error => {
            console.log('ray : [ForgotPassword errorCallback] error => ', error);
            this.setState({sentEmailMessage: error.response.status, loading: false});
        };
        
        this.props.sendResetEmail(data, successCallback, errorCallback);
    };

    signInHandler = () => {
        this.props.history.push(pageLinks.Login.url);
    };

    render() {
        const { classes, errors } = this.props;
        const { email, sentEmailMessage, loading } = this.state;
        return (
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Fogot Password
                    </Typography>
                    <form className={classes.form} onSubmit={this.submitHandler}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input 
                                id="email" 
                                name="email" 
                                autoComplete="email"
                                autoFocus
                                onChange={this.inputChangeHandler}
                                value={email} />
                            <Typography color="error">
                                {errors && errors.email}
                            </Typography>
                        </FormControl>
                        <Typography align="center">
                            {sentEmailMessage}
                        </Typography>
                        <Button
                            disabled={loading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Send Password Reset Email
                        </Button>
                        <Link
                            component="button"
                            variant="body2"
                            className={classes.signIn}
                            onClick={this.signInHandler}>
                            Sign In
                        </Link>
                    </form>
                </Paper>
            </main>
        );
    }
}

ForgotPassword.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.auth.errors
});
const mapActionToProps = {
    sendResetEmail,
    clearAuthErrors
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(ForgotPassword));
