import React, { Component } from 'react'
import { Card as MaterialCard, CardContent, CardActions, Typography, withStyles } from '@material-ui/core'

const styles = {
    card: {
        width: 300,
        margin: 20,
        backgroundColor: '#eee',
        textAlign: "left"
    }
}


class Card extends Component {
    render() {

        const { classes } = this.props

        return (
            <MaterialCard className={classes.card}>
                <CardContent>
                    <Typography>
                        some text
                    </Typography>
                </CardContent>
                <CardActions>
                    <Typography>
                        some action
                    </Typography>
                </CardActions>
            </MaterialCard>
        )
    }
}

export default withStyles(styles)(Card)