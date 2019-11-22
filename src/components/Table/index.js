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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined'
import { changeTitleAction } from '../../redux/reducers/tablesReducer'
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
    title: {
        display: 'flex',
        alignItems: 'center',
    },
    titleText: {
        flex: 1,
    },
    editTitle: {
        transition: 'opacity .2s ease-in-out',
    },
    titleInput: {},
}

class Table extends Component {
    state = {
        isCreatingCard: false,
        newCardText: '',
        isMouseOverTitle: false,
        isEditingTitle: false,
        titleInputValue: this.props.table.title,
    }

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
        this.setState({
            newCardText: '',
            isCreatingCard: false,
        })
    }

    handleCancelButton = () => {
        this.setState({
            newCardText: '',
            isCreatingCard: false,
        })
    }

    handleEditTitleButton = () => {
        this.setState({ isEditingTitle: true })
    }

    handleMouseOverTitle = () => {
        this.setState({ isMouseOverTitle: true })
    }

    handleMouseOutTitle = () => {
        this.setState({ isMouseOverTitle: false })
    }

    handleConfirmTitle = () => {
        this.props.changeTitle(this.state.titleInputValue, this.props.table.id)
        this.setState({ isEditingTitle: false })
    }

    handeTitleInputChange = (ev) => {
        this.setState({
            titleInputValue: ev.target.value,
        })
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
        const { isCreatingCard, isMouseOverTitle, isEditingTitle } = this.state

        return (
            <Draggable draggableId={table.id} index={index}>
                {(provided) => (
                    <Container
                        className={classes.table}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Container
                            className={classes.title}
                            onMouseOver={this.handleMouseOverTitle}
                            onMouseOut={this.handleMouseOutTitle}
                        >
                            {!isEditingTitle && (
                                <>
                                    <Typography variant="h4" className={classes.titleText}>
                                        {table.title}
                                    </Typography>

                                    <IconButton
                                        style={{ opacity: +isMouseOverTitle }}
                                        title="Edit title"
                                        size="small"
                                        onClick={this.handleEditTitleButton}
                                        className={classes.editTitle}
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}

                            {isEditingTitle && (
                                <>
                                    <InputBase
                                        autoFocus
                                        className={classes.titleInput}
                                        onChange={this.handeTitleInputChange}
                                        value={this.state.titleInputValue}
                                        inputProps={{ 'aria-label': 'naked' }}
                                    />
                                    <IconButton
                                        size="small"
                                        title="Confirm"
                                        onClick={this.handleConfirmTitle}
                                    >
                                        <CheckOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Container>

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
                                    label="title of the card"
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
    changeTitle: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
}

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
})

const mapDispatchToProps = {
    createCard: createCardAction,
    changeTitle: changeTitleAction,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
