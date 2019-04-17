import React from 'react'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'

import AddIcon from '@material-ui/icons/Add'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditOutlineIcon from '@material-ui/icons/EditOutlined'

import Dialog from 'components/Dialog'
import EditNodeDialog from 'components/EditNodeDialog'
import Page from 'views/Page/Page.jsx'
import PropForm from 'components/PropForm'
import PropertyDrawer from 'components/PropertyDrawer'

import { nodes } from 'app'
/**
 * @typedef {import('app/typings').Node} Node
 */

/**
 * @param {import('@material-ui/core/styles').Theme} theme
 */
const styles = theme => ({
  addButton: {
    backgroundColor: '#f34930',
    bottom: '40px',
    boxShadow:
      '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    color: '#fff',
    position: 'absolute',
    right: '50px',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  card: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    padding: '20px 5px',
    backgroundColor: theme.palette.background.paper,
  },
  itemOption: {
    display: 'flex !important',
    flexDirection: 'column !important',
    right: '10px !important',
  },
  listItem: {
    paddingLeft: '15px',
  },
  pointerCursor: {
    cursor: 'pointer',
  },
  root: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
    width: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 2,
    },
  },
  smallIconButton: {},
})

/**
 * @typedef {keyof ReturnType<typeof styles>} Classes
 */

/**
 * @typedef {object} Props
 * @prop {Record<Classes, string>} classes
 */

/**
 * @typedef {object} State
 * @prop {Record<string, Node>} nodes
 * @prop {string|null} selectedNodeID
 * @prop {boolean} showingAddNodeDialog
 * @prop {boolean} showingAddRelDialog
 * @prop {boolean} showingEditNodeDialog
 * @prop {boolean} showingPropDialog
 */

/**
 * @augments React.Component<Props, State>
 */
class NodesAndProps extends React.Component {
  /** @type {State} */
  state = {
    nodes: {},
    selectedNodeID: null,
    showingAddNodeDialog: false,
    showingAddRelDialog: false,
    showingEditNodeDialog: false,
    showingPropDialog: false,
  }

  componentDidMount() {
    nodes.on(this.onUpdate)
  }

  /**
   * @param {Record<string, Node>} nodes
   */
  onUpdate = nodes => {
    this.setState({
      nodes,
    })
  }

  componentWillUnmount() {
    nodes.off(this.onUpdate)
  }

  handleClosePropForm = () => {
    this.setState({
      showingPropDialog: false,
    })
  }

  /** @private */
  onClickAddProperty = () => {
    this.setState({
      showingPropDialog: true,
    })
  }

  /**
   * @param {string} id
   */
  onClickNode = id => {
    this.setState({
      selectedNodeID: id,
    })
  }

  onClickEditNode = e => {
    console.log('onClickEditNode')
    console.log(e)
  }

  /** @private */
  toggleAddNodeDialog = () => {
    this.setState(({ showingAddNodeDialog }) => ({
      showingAddNodeDialog: !showingAddNodeDialog,
    }))
  }

  /** @private */
  toggleAddRelDialog = () => {
    this.setState(({ showingAddRelDialog }) => ({
      showingAddRelDialog: !showingAddRelDialog,
    }))
  }

  /** @private */
  toggleEditNodeDialog = () => {
    this.setState(({ showingEditNodeDialog }) => ({
      showingEditNodeDialog: !showingEditNodeDialog,
    }))
  }

  /** @private */
  handleClosePropsDrawer = () => {
    this.setState({
      selectedNodeID: null,
    })
  }

  render() {
    const { classes } = this.props
    const {
      nodes,
      selectedNodeID,
      showingAddNodeDialog,
      showingEditNodeDialog,
    } = this.state

    const selectedNode =
      typeof selectedNodeID === 'string' &&
      Object.entries(nodes).filter(([id]) => id === selectedNodeID)[0][1]

    return (
      <React.Fragment>
        <Dialog
          open={showingAddNodeDialog}
          title="Add a Node"
          handleClose={this.toggleAddNodeDialog}
        >
          <PropForm availableTypes={[]} />
        </Dialog>

        <Dialog
          open={showingEditNodeDialog}
          title="Edit Node"
          handleClose={this.toggleEditNodeDialog}
        >
          <EditNodeDialog />
        </Dialog>

        <Page titleText="Nodes And Properties">
          <Grid container className={classes.root}>
            {selectedNode && (
              <PropertyDrawer
                open
                propertyItems={Object.entries(selectedNode.propDefs).map(
                  ([id, propDef]) => ({
                    ...propDef,
                    _: {
                      '#': id,
                    },
                  }),
                )}
                handleClose={this.handleClosePropsDrawer}
              />
            )}

            {Object.entries(nodes).map(([id, node]) => (
              <Grid
                className={classes.pointerCursor}
                item
                xs={12}
                md={3}
                key={id}
                onClick={() => {
                  this.onClickNode(id)
                }}
              >
                <List className={classes.card}>
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <DeleteOutlineIcon />
                    </ListItemAvatar>

                    <ListItemText primary={node.label} secondary={node.name} />

                    <ListItemSecondaryAction className={classes.itemOption}>
                      <IconButton
                        aria-label="Edit"
                        className={classes.smallIconButton}
                        onClick={this.onClickEditNode}
                      >
                        <EditOutlineIcon />
                      </IconButton>
                      <IconButton
                        aria-label="Delete"
                        color="secondary"
                        className={classes.smallIconButton}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            ))}

            <IconButton
              color="secondary"
              className={classes.addButton}
              onClick={() => {
                this.setState(state => ({
                  showingAddNodeDialog: !state.showingAddNodeDialog,
                }))
              }}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Page>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NodesAndProps)
