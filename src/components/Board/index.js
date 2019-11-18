import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Table from '../Table'

const styles = {
    board: {
        display: "flex",
        flexFlow: "row wrap"
    }
}

class Board extends Component {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.board}>
                <Table name={'To do'}/>           
                <Table name={'Doing'}/>           
                <Table name={'Done'}/>           
            </div>
        )
    }
}

export default withStyles(styles)(Board)