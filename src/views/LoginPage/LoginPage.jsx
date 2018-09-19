import React from "react";
//gundb
import Gun from 'gun/gun'
//Navigation
import { Redirect } from 'react-router-dom'
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from '@material-ui/core/FormHelperText';
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
//Styles
import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.jsx";
//Media
import Logo from 'assets/img/crmLogo.png'
const gun = Gun('https://crm-server.herokuapp.com/gun');
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        username: '',
        password: '',
        authenticated: false,
        inputError: false,
        emailNotFound: false,
        correctEmail: false
      }
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }
  keyPress(e) {
       if(e.keyCode === 13) {
        this.handleAuthentication()
      }
  }
  handleEmail(event) {
      gun.get('users').get(event.target.value.toLowerCase()).once((data) => {
        data === undefined
          ? this.setState({ emailNotFound: true })
          : this.setState({ emailNotFound: false, correctEmail: true })
      })
    this.setState({ username: event.target.value.toLowerCase() })
  }
  handlePassword(event) {
    this.setState({ password: event.target.value })
  }
  handleAuthentication() {
    const { username, password } = this.state
    const ref = gun.get('users').get(username).get('password')
        ref.once((data) => {
          password === data
            ? this.setState({ authenticated: true })
            : this.setState({ authenticated: false, inputError: true, password: '' })
        })
  }
  render() {
    const { classes } = this.props;
    const { authenticated, emailNotFound, correctEmail, username } = this.state;
      return !authenticated 
        ? (
            <div>
              <div className={classes.container}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={4}>
                    <Card>
                      <form className={classes.form}>
                        <CardHeader
                          color="transparent"
                          noShadow
                          signup
                          className={classes.cardHeader}
                        >
                          <div className={classes.logo}>
                            <img src={Logo} alt={'Sign in to continue'}/>
                          </div>
                        </CardHeader>
                        <CardBody signup>
                          <CustomInput
                            id="email"
                            labelText={ correctEmail ? 'Email*' : null }
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              placeholder: "Email*",
                              error: emailNotFound,
                              type: "text",
                              autoComplete: "email",
                              onChange: (e) => this.handleEmail(e),
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                          {
                            this.state.emailNotFound 
                              ? <FormHelperText 
                                  style={{marginTop: -10, marginLeft: 10}} 
                                  error 
                                  id="name-error-text"
                                >
                                  Incorrect Email
                                </FormHelperText> 
                              : null
                          }
                          <CustomInput
                            id="pass"
                            error={this.state.inputError}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              disabled: !correctEmail,
                              error: this.state.inputError,
                              value: this.state.password,
                              placeholder: "Password*",
                              type: "password",
                              autoComplete: "current-password",
                              onChange: (e) => this.handlePassword(e),
                              onKeyDown: (e) => this.keyPress(e),
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockOutline
                                    className={classes.inputIconsColor}
                                  />
                                </InputAdornment>
                              )
                            }}
                          />
                          {
                          this.state.inputError 
                            ? <FormHelperText 
                                style={{marginTop: -10, marginLeft: 10}} 
                                error 
                                id="name-error-text"
                              >
                                Incorrect Password/Email Combination
                              </FormHelperText> 
                            : null
                          }
                          <div style={{ marginBottom: 15, }}>
                            <Button 
                              fullWidth={true} 
                              color="info" 
                              variant="raised"
                              onClick={this.handleAuthentication}
                            >
                              Login
                            </Button>
                          </div>
                        </CardBody>
                      </form>
                    </Card>
                  </GridItem>
                </GridContainer>
              </div>
            </div>
        )
      : (
          <Redirect push to={`/dashboard/${username}`}/>
        )
  }
}
export default withStyles(loginPageStyle)(LoginPage);