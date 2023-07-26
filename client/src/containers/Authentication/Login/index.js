
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

import { loginUser, clearAuthErrors } from '../../../actions/authentication';
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
        signUp: {
            width: '100%',
            padding: spacingUnit * 2
        }
    };
};

class Login extends Component {
    state = {
        email: '',
        password: ''
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
        const user = {
            email: this.state.email,
            password: this.state.password,
        };
        
        this.props.loginUser(user, this.props.history);
    };

    signUpHandler = () => {
        this.props.history.push(pageLinks.Register.url);
    };

    render() {
        const { classes, errors } = this.props;
        return (
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <form className={classes.form} onSubmit={this.submitHandler}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            {/* TODO: email check validation could be done on frontend not by response */}
                            <Input 
                                id="email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={this.inputChangeHandler}
                                value={this.state.email} />
                            <Typography color="error">
                                {errors && errors.email}
                            </Typography>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input 
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                onChange={this.inputChangeHandler}
                                value={this.state.password} />
                            <Typography color="error">
                                {errors && errors.password}
                            </Typography>
                        </FormControl>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between">
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me" />
                            <Link
                                component={RouterLink}
                                to={pageLinks.ForgotPassword.url}
                                variant="body2">
                                Forgot Password?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Sign In
                        </Button>
                        <Link
                            component="button"
                            variant="body2"
                            className={classes.signUp}
                            onClick={this.signUpHandler} >
                            Sign Up
                        </Link>
                    </form>
                </Paper>
            </main>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    errors: state.auth.errors
});
const mapActionToProps = {
    loginUser,
    clearAuthErrors
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Login));

