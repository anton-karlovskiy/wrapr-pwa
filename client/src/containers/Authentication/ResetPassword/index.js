
import React, { Fragment, Component } from 'react';
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
import queryString from 'query-string';

import Loading from '../../../components/Loading';
import { checkResetPassword, resetPassword } from '../../../actions/authentication';
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

class ResetPassword extends Component {
    state = {
        email: '',
        password: '',
        updated: false,
        isLoading: true,
        errors: null,
        resetPasswordMessage: ''
    };

    componentDidMount() {
        this._mounted = true;
        const { checkResetPassword, location } = this.props;
        const { token: resetPasswordToken } = queryString.parse(location.search);
        const successCallback = response => {
            const { data: { email } } = response;
            if (this._mounted) {
                this.setState({
                    email,
                    updated: false,
                    isLoading: false,
                    errors: null
                });
            }
        };
        const errorCallback = error => {
            if (error.response && error.response.data) {
                const errors = {
                    status: error.response.status,
                    message: error.response.data.message
                };
                if (this._mounted) {
                    this.setState({
                        updated: false,
                        isLoading: false,
                        errors
                    });
                }
            } else {
                console.error('ray : [ResetPassword componentDidMount errorCallback] something went wrong');
            }
        };
        checkResetPassword(resetPasswordToken, successCallback, errorCallback);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const { email, password } = this.state;
        const { token: resetPasswordToken } = queryString.parse(this.props.location.search);
        const data = {
            email,
            password,
            resetPasswordToken
        };

        const successCallback = response => {
            const { data: { message } } = response;
            if (this._mounted) {
                this.setState({
                    resetPasswordMessage: message,
                    updated: true,
                    errors: null
                });
            }
        };
        const errorCallback = error => {
            if (error.response && error.response.data) {
                const errors = {
                    status: error.response.status,
                    message: error.response.data.message,
                    password: error.response.data.password
                };
                if (this._mounted) {
                    this.setState({
                        updated: false,
                        errors
                    });
                }
            } else {
                console.error('ray : [ResetPassword componentDidMount errorCallback] something went wrong');
            }
        };

        this.props.resetPassword(data, successCallback, errorCallback);
    };

    signInHandler = () => {
        this.props.history.push(pageLinks.Login.url);
    };

    signUpHandler = () => {
        this.props.history.push(pageLinks.Register.url);
    };

    forgotPasswordHandler = () => {
        this.props.history.push(pageLinks.ForgotPassword.url);
    };

    render() {
        const { classes } = this.props;
        const { password, resetPasswordMessage, updated, errors, isLoading } = this.state;
        if (isLoading) {
            return (
                <Loading />
            );
        }

        return (
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <form className={classes.form} onSubmit={this.submitHandler}>
                        { updated ? (
                            <Fragment>
                                <Typography align="center">
                                    {resetPasswordMessage}
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={this.signInHandler}
                                    className={classes.submit}>
                                    Sign In
                                </Button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <FormControl margin="normal" required fullWidth>
                                    { (!errors || errors.password) && (
                                        <Fragment>
                                            <InputLabel htmlFor="password">Password</InputLabel>
                                            <Input 
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                onChange={this.inputChangeHandler}
                                                value={password} />
                                            <Typography color="error">
                                                {errors && errors.password}
                                            </Typography>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}>
                                                Reset Password
                                            </Button>
                                        </Fragment>
                                    ) } 
                                    { errors && errors.status === 403 && (
                                        <Fragment>
                                            <Typography align="center">
                                                {errors.message}
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={this.forgotPasswordHandler}
                                                className={classes.submit}>
                                                Forgot Password
                                            </Button>
                                        </Fragment>
                                    ) }
                                    { errors && errors.status === 404 && (
                                        <Fragment>
                                            <Typography align="center">
                                                {errors.message}
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={this.signUpHandler}
                                                className={classes.submit}>
                                                Sign Up
                                            </Button>
                                        </Fragment>
                                    ) }
                                </FormControl>
                                <Link
                                    component="button"
                                    variant="body2"
                                    className={classes.signIn}
                                    onClick={this.signInHandler}>
                                    Sign In
                                </Link>
                            </Fragment>
                        ) }
                    </form>
                </Paper>
            </main>
        );
    }
}

ResetPassword.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapActionToProps = {
    checkResetPassword,
    resetPassword
};

export default connect(null, mapActionToProps)(withStyles(styles)(ResetPassword));
