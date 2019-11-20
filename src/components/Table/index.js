import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import { Typography, withStyles, TextField, Button, List } from '@material-ui/core'
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
}

class Table extends Component {
    initialState = {
        creatingCard: false,
        textFieldValue: '',
    }

    state = { ...this.initialState }

    handleAddButton = () => {
        this.setState({
            creatingCard: true,
        })
    }

    handleTextFieldChange = (ev) => {
        this.setState({
            textFieldValue: ev.target.value,
        })
    }

    handleCreateButton = () => {
        if (!this.state.textFieldValue) return

        const newCard = {
            id: Math.random()
                .toString(36)
                .substring(2, 15),
            text: this.state.textFieldValue,
            tableId: this.props.table.id,
        }

        this.props.createCard(newCard)
        this.setState(this.initialState)
    }

    handleCancelButton = () => {
        this.setState(this.initialState)
    }

    getCards = () => {
        const cards = this.props.table.cardIds.map((cardId) => this.props.cardsState[cardId])
        return cards.length ? (
            cards.map((item, index) => <Card key={item.id} card={item} index={index} />)
        ) : (
            <Typography>No cards yet...</Typography>
        )
    }

    render() {
        const { classes, table } = this.props
        const { creatingCard } = this.state

        return (
            <div className={classes.table}>
                <Typography variant="h4">{table.title}</Typography>

                <Droppable droppableId={this.props.table.id}>
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

                {!creatingCard && <Button onClick={this.handleAddButton}>create new card</Button>}

                {creatingCard && (
                    <div>
                        <TextField
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
                    </div>
                )}
            </div>
        )
    }
}

Table.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        cardIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    cardsState: PropTypes.objectOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    createCard: PropTypes.func.isRequired,
}

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
})

const mapDispatchToProps = {
    createCard: createCardAction,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
