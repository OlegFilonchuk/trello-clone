import React, { Component } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import Card from '../Card'

const styles = {
    table: {
        textAlign: "center",
        backgroundColor: "#ddd",
        margin: 20
    }
}

class Table extends Component {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.table}>
                <Typography>
                    {this.props.name}
                </Typography>
                <Card/>
                <Card/>
                <Card/>
            </div>
        )
    }
}

export default withStyles(styles)(Table)