import React, { Component } from 'react'
import { Card as MaterialCard, CardContent, Typography, withStyles } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'

const styles = {
    card: {
        width: 300,
        margin: 20,
        backgroundColor: '#eee',
        textAlign: 'left',
    },
}

class Card extends Component {
    render() {
        const { classes } = this.props
        const { text, id } = this.props.card

        return (
            <Draggable draggableId={id} index={this.props.index}>
                {(provided) => (
                    <MaterialCard
                        className={classes.card}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                    >
                        <CardContent>
                            <Typography>{text}</Typography>
                        </CardContent>
                    </MaterialCard>
                )}
            </Draggable>
        )
    }
}

export default withStyles(styles)(Card)
