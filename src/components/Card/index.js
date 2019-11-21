import React from 'react'
import PropTypes from 'prop-types'
import {
    Card as MaterialCard,
    CardContent,
    Typography,
    makeStyles,
    CardActions,
    Button,
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import { removeCardAction } from '../../redux/reducers/cardsReducer'

const useStyles = makeStyles({
    card: {
        width: 300,
        marginBottom: 10,
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'row',
    },
    content: {
        flex: 1,
    },
    remove: {},
})

const Card = (props) => {
    const {
        index,
        card: { id, text },
    } = props
    const classes = useStyles(props)

    const handleRemoveButton = () => {
        const table = props.tablesState.find((item) => item.id === props.card.tableId)
        const newCardIds = table.cardIds.filter((item) => item !== props.card.id)
        props.removeCard(props.card, newCardIds)
    }

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <MaterialCard
                    className={classes.card}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={provided.innerRef}
                >
                    <CardContent className={classes.content}>
                        <Typography>{text}</Typography>
                    </CardContent>
                    <CardActions className={classes.remove}>
                        <Button onClick={handleRemoveButton}>x</Button>
                    </CardActions>
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
    removeCard: PropTypes.func.isRequired,
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
})
const mapDispathToProps = {
    removeCard: removeCardAction,
}

export default connect(mapStateToProps, mapDispathToProps)(Card)
