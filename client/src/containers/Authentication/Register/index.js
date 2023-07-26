
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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

import { registerUser, clearAuthErrors } from '../../../actions/authentication';
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

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        agreed: false
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
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        };
        this.props.registerUser(user, this.props.history);
    };

    signInHandler = () => {
        this.props.history.push(pageLinks.Login.url);
    };

    agreeCheckBoxHandler = () => {
        this.setState({
            agreed: !this.state.agreed
        });
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
                        Sign Up
                    </Typography>
                    <form className={classes.form} onSubmit={this.submitHandler}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <Input 
                                id="name"
                                name="name"
                                type="text"
                                autoFocus
                                onChange={this.inputChangeHandler}
                                value={this.state.name} />
                            <Typography color="error">
                                {errors && errors.name}
                            </Typography>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input 
                                id="email"
                                name="email"
                                autoComplete="email"
                                onChange={this.inputChangeHandler}
                                value={this.state.email} />
                            <Typography color="error">
                                {errors && errors.email}
                            </Typography>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input 
                                name="password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.inputChangeHandler}
                                value={this.state.password} />
                            <Typography color="error">
                                {errors && errors.password}
                            </Typography>
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="passwordConfirm">Password Confirm</InputLabel>
                            <Input
                                name="passwordConfirm"
                                type="password"
                                id="passwordConfirm"
                                autoComplete="current-password"
                                onChange={this.inputChangeHandler}
                                value={this.state.passwordConfirm} />
                            <Typography color="error">
                                {errors && errors.passwordConfirm}
                            </Typography>
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="agreement" color="primary" onChange={this.agreeCheckBoxHandler} />}
                            label="I agree with the terms and conditions" />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!this.state.agreed}>
                            Sign Up
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

Register.propTypes = {
    classes: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    errors: state.auth.errors
});
const mapActionToProps = {
    registerUser,
    clearAuthErrors
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Register));
