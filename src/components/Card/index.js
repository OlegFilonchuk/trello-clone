import React, { Component } from "react"
import { Card as MaterialCard, CardContent, Typography, withStyles } from "@material-ui/core"

const styles = {
    card: {
        width: 300,
        margin: 20,
        backgroundColor: "#eee",
        textAlign: "left",
    },
}

class Card extends Component {
    render() {
        const { classes } = this.props
        const { text } = this.props.card

        return (
            <MaterialCard className={classes.card}>
                <CardContent>
                    <Typography>{text}</Typography>
                </CardContent>
            </MaterialCard>
        )
    }
}

export default withStyles(styles)(Card)
