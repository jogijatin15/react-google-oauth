import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class GoogleOAuth extends Component {

	state = {
		isSignedIn: false
	}

	componentDidMount = () => {
		window.gapi.load('auth2', () => {
			window.gapi.auth2.init({
				client_id: '.apps.googleusercontent.com',
				scope: 'email'
			}).then(() => {
				this.auth = window.gapi.auth2.getAuthInstance();
				this.setState({ isSignedIn: this.auth.isSignedIn.get() })
				this.auth.isSignedIn.listen(this.onAuthChange)
			})
		});
	}

	componentWillUnmount = () => {
		this.auth = null;
	}

	onAuthChange = () => {
		this.setState({
			isSignedIn: this.auth.isSignedIn.get()
		})
	}

	handleSignIn = () => {
		this.auth.signIn();
	}

	handleSignOut = () => {
		this.auth.signOut();
	}

	getProfileSpecifics = (type) => {
		const GoogleUser = this.auth.currentUser.get();
		const BasicProfile = GoogleUser ? GoogleUser.getBasicProfile() : null;

		if (BasicProfile) {
			switch (type) {
				case 'id':
					return BasicProfile.getId();
					break;
				case 'name':
					return BasicProfile.getName();
					break;
				case 'givenName':
					return BasicProfile.getGivenName();
					break;
				case 'familyName':
					return BasicProfile.getFamilyName();
					break;
				case 'imageUrl':
					return BasicProfile.getImageUrl();
					break;
				case 'email':
					return BasicProfile.getEmail();
					break;
				default:
					return null;
			}
		}
	}

	render() {
		const { isSignedIn } = this.state;

		return (
			isSignedIn
				? (
					<div className="xp__in">
						<span>{`Hello ${this.getProfileSpecifics('name')}`}</span>
						<Button className="xp__signout" onClick={this.handleSignOut}>Sign Out</Button>
					</div>
				)
				: (
					<div className="xp__out">
						<Button className="xp__signin" onClick={this.handleSignIn}>Sign In with Google</Button>
					</div>
				)
		)
	}
}

export default GoogleOAuth;