import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import {
    Typography,
    withStyles,
    TextField,
    Button,
    List,
    Container,
    InputBase,
    IconButton,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { createCardAction } from '../../redux/reducers/cardsReducer'
import Card from '../Card'

const styles = {
    table: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ddd',
        margin: 10,
        width: 390,
    },
    list: {
        flexGrow: 1,
        minHeight: 100,
        padding: 10,
    },
    newCard: {
        display: 'flex',
    },
    createButton: {
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
}

class Table extends Component {
    initialState = {
        isCreatingCard: false,
        newCardText: '',
    }

    state = { ...this.initialState }

    handleAddButton = () => {
        this.setState({
            isCreatingCard: true,
        })
    }

    handleTextFieldChange = (ev) => {
        this.setState({
            newCardText: ev.target.value,
        })
    }

    handleCreateButton = (ev) => {
        ev.preventDefault()
        const { createCard, table } = this.props
        if (!this.state.newCardText) return

        const newCard = {
            id: Math.random()
                .toString(36)
                .substring(2, 15),
            text: this.state.newCardText,
            tableId: table.id,
        }

        createCard(newCard, table.cardIds)
        this.setState(this.initialState)
    }

    handleCancelButton = () => {
        this.setState(this.initialState)
    }

    getCards = () => {
        const { table, cardsState } = this.props

        if (cardsState.length) {
            const cards = table.cardIds.map((cardId) =>
                cardsState.find((item) => item.id === cardId)
            )
            if (cards.length)
                return cards.map((item, index) => <Card key={item.id} card={item} index={index} />)
        }
        return <Typography>No cards yet...</Typography>
    }

    render() {
        const { classes, table, index } = this.props
        const { isCreatingCard } = this.state

        return (
            <Draggable draggableId={table.id} index={index}>
                {(provided) => (
                    <Container
                        className={classes.table}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <Typography variant="h4" {...provided.dragHandleProps}>
                            {table.title}
                        </Typography>

                        <InputBase
                            className={classes.margin}
                            defaultValue="Naked input"
                            inputProps={{ 'aria-label': 'naked' }}
                        />

                        <Droppable droppableId={this.props.table.id} type="card">
                            {(provided) => (
                                <List
                                    className={classes.list}
                                    innerRef={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {this.getCards()}
                                    {provided.placeholder}
                                </List>
                            )}
                        </Droppable>

                        {!isCreatingCard && (
                            <IconButton
                                onClick={this.handleAddButton}
                                className={classes.createButton}
                                title="Create new card"
                            >
                                <AddIcon />
                            </IconButton>
                        )}

                        {isCreatingCard && (
                            <form className={classes.newCard} onSubmit={this.handleCreateButton}>
                                <TextField
                                    className={classes.textField}
                                    label="enter a title for this card..."
                                    onChange={this.handleTextFieldChange}
                                    autoFocus
                                />
                                <Button variant="contained" onClick={this.handleCreateButton}>
                                    Create
                                </Button>
                                <Button variant="contained" onClick={this.handleCancelButton}>
                                    Cancel
                                </Button>
                            </form>
                        )}
                    </Container>
                )}
            </Draggable>
        )
    }
}

Table.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    cardsState: PropTypes.arrayOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    createCard: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
}

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
})

const mapDispatchToProps = {
    createCard: createCardAction,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
