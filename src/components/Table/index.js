import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createCardAction } from '../../redux/reducers/cardsReducer'
import { Typography, withStyles, TextField } from '@material-ui/core'
import Card from '../Card'
import './Table.css'

const styles = {
    table: {
        textAlign: 'center',
        backgroundColor: '#ddd',
        margin: 20,
    },
}

class Table extends Component {
    state = {
        creatingCard: false,
        textFieldValue: '',
    }

    handleAddButton = (ev) => {
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
        const newCard = {
            id: Math.random()
                .toString(36)
                .substring(2, 15),
            text: this.state.textFieldValue,
            tableId: this.props.id,
        }

        this.props.createCard(newCard)
        this.setState({
            creatingCard: false,
        })
    }

    getCards = () => {
        return this.props.cardsState.cards.reduce(
            (acc, item) =>
                item.tableId === this.props.id ? [...acc, <Card key={item.id} card={item} />] : acc,
            []
        )
    }

    render() {
        const { classes } = this.props
        const { creatingCard } = this.state

        return (
            <div className={classes.table}>
                <Typography>{this.props.name}</Typography>
                {this.getCards()}
                {!creatingCard && <button onClick={this.handleAddButton}>create new card</button>}
                {creatingCard && (
                    <div>
                        <TextField
                            label={'enter a title for this card'}
                            onChange={this.handleTextFieldChange}
                        />
                        <button onClick={this.handleCreateButton}>Create</button>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
})

const mapDispatchToProps = {
    createCard: createCardAction,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
