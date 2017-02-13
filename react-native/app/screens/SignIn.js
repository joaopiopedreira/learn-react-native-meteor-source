import React, {Component, PropTypes} from 'react';
import {Card} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import Router from '../config/router';
import Container from '../components/Container';
import {Input, PrimaryButton} from '../components/Form';
import config from '../config/config';


class SignIn extends Component {
    static route = {
        navigationBar: {
            visible: true,
            title: 'Sign In',
        },
    }

    static propTypes = {
        navigator: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            emailOrUsername: '',
            password: '',
        };
    }

    signIn = () => {
        const {emailOrUsername, password} = this.state;

        if (emailOrUsername.length === 0) {
            return this.props.navigator.showLocalAlert('Email or username is required.', config.errorStyles);
        }

        if (password.length === 0) {
            return this.props.navigator.showLocalAlert('Password is required.', config.errorStyles);
        }

        this.setState({loading: true});
        return Meteor.loginWithPassword(emailOrUsername, password, (err) => {
            if (err) {
                this.props.navigator.showLocalAlert(err.reason, config.errorStyles);
            } else {
                this.setState({loading: false});
                this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
            }
        });
    };

    handleTextChange = (text, field) => {
        const update = {};
        update[field] = text;
        this.setState(update);
    };

    render() {
        return (
            <Container scroll>
                <Card>
                    <Input
                        label="Email or Username"
                        placeholder="Please enter your email or username..."
                        onChangeText={(text) => this.handleTextChange(text, 'emailOrUsername')}
                    />
                    <Input
                        label="Password"
                        placeholder="Please enter your password..."
                        secureTextEntry
                        onChangeText={(text) => this.handleTextChange(text, 'password')}
                    />
                    <PrimaryButton
                        title="Sign In"
                        onPress={this.signIn()}
                        loading={this.state.loading}
                    />
                </Card>
            </Container>
        );
    }
}

export default SignIn;
