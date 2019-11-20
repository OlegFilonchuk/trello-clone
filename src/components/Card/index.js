import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card as MaterialCard, CardContent, Typography, withStyles } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'

const styles = {
    card: {
        width: 300,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    red: {
        color: 'red',
    },
}

class Card extends Component {
    render() {
        const {
            classes,
            card: { text, id },
        } = this.props

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

Card.propTypes = {
    index: PropTypes.number.isRequired,
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
    }).isRequired,
}

export default withStyles(styles)(Card)
