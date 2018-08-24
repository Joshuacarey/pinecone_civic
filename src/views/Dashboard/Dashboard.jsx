import React, { Component } from 'react';
import PropTypes from 'prop-types';
//material ui components
import { withStyles } from '@material-ui/core/styles';
//project components
import Page from 'views/Page/Page.jsx';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Cards from "components/Cards/Card.jsx";
//gundb
import Gun from 'gun/gun';
const gun = Gun('https://crm-server.herokuapp.com/gun');
const db = gun.get('users')
const styles = theme => ({
	root: {

	},
	layout: {

	},
	content: {
		display: 'flex',
		justifyContent: 'center', 
		[theme.breakpoints.up('lg')]: {
			marginTop: theme.spacing.unit * 8,
		},
		[theme.breakpoints.down('md')]: {
			marginTop: theme.spacing.unit * 8
		},
	},
})
class Dashboard extends Component {
	constructor(props) {
		super(props);
			this.state = {
				user: '',
			}
	}
	componentDidMount() {
		const { match } = this.props;
		const profile = match.params.id
			db.get(profile).once((user) => {
				this.setState({ user: user })
			});
	}
	render() {
		const { classes } = this.props
		return (
			<div classNames={classes.root}>
				<Page component={'dashboard'}>
					<div className={classes.content}>
			          <GridContainer className={classes.layout} spacing={0}>
			            <GridItem  xs={12} sm={12} md={6} lg={6} xl={6}>
				            <div>
				 				<Cards />
				 			</div>
			            </GridItem>
			            <GridItem xs={12} sm={12} md={6} lg={6} xl={6}>
				            <div>
				 				<Cards />
				 			</div>
			            </GridItem>
			          </GridContainer>
		          	</div>
				</Page>
			</div>
		)
	}
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Dashboard);