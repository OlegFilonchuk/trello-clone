import React from 'react'
import PropTypes from 'prop-types'
import { Card as MaterialCard, CardContent, Typography, makeStyles } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'

const useStyles = makeStyles({
    card: {
        width: 300,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    red: {
        color: 'red',
    },
})

const Card = (props) => {
    const {
        index,
        card: { id, text },
    } = props
    const classes = useStyles(props)
    return (
        <Draggable draggableId={id} index={index}>
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

Card.propTypes = {
    index: PropTypes.number.isRequired,
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
    }).isRequired,
}

export default Card
