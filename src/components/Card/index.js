import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Card as MaterialCard,
    CardContent,
    Typography,
    withStyles,
    CardActions,
    Modal,
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import { removeCardAction } from '../../redux/reducers/cardsReducer'
import './Card.css'
import OpenCard from '../OpenCard'

const styles = {
    card: {
        cursor: 'pointer !important',
        width: 300,
        marginBottom: 10,
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'row',
        '&:hover .trial': {
            display: 'flex',
        },
    },
    content: {
        flex: 1,
    },
}

class Card extends Component {
    state = {
        // eslint-disable-next-line react/no-unused-state
        isOpen: false,
    }

    handleCardClick = async () => {
        await this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }))
    }

    handleRemoveButton = () => {
        const { tablesState, card, removeCard } = this.props
        const table = tablesState.find((item) => item.id === card.tableId)
        const newCardIds = table.cardIds.filter((item) => item !== card.id)
        removeCard(card, newCardIds)
    }

    render() {
        const {
            index,
            card: { id, text },
            classes,
        } = this.props

        return (
            <Draggable draggableId={id} index={index}>
                {(provided) => (
                    <MaterialCard
                        onClick={this.handleCardClick}
                        className={classes.card}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                    >
                        <CardContent className={classes.content}>
                            <Typography>{text}</Typography>
                        </CardContent>
                        <CardActions className={classes.remove}>
                            <button
                                type="button"
                                onClick={this.handleRemoveButton}
                                className="trial"
                            >
                                x
                            </button>
                        </CardActions>
                        <Modal open={this.state.isOpen} onClose={this.handleClose}>
                            <OpenCard />
                        </Modal>
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
    removeCard: PropTypes.func.isRequired,
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
}

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
})
const mapDispathToProps = {
    removeCard: removeCardAction,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispathToProps)(Card))
