import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Typography,
    withStyles,
    TextField,
    List,
    Container,
    InputBase,
    IconButton,
    Paper,
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import ClearOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { changeTitleAction, removeTableAction } from '../../redux/reducers/tablesReducer';
import { createCardAction } from '../../redux/reducers/cardsReducer';
import Card from '../Card';

const styles = {
    table: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ededed',
        padding: 20,
        margin: 10,
        width: 380,
    },
    list: {
        flexGrow: 1,
        padding: 10,
    },
    newCard: {
        display: 'flex',
        alignItems: 'center',
        padding: 10,
    },
    createButton: {
        alignSelf: 'flex-start',
    },
    title: {
        display: 'flex',
        alignItems: 'center',
    },
    titleText: {
        flex: 1,
        cursor: 'pointer',
        paddingTop: 9,
        paddingBottom: 8,
    },
    editTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
    },
    titleInput: {
        flex: 1,
        fontSize: 24,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1.17,
        border: '1px solid grey',
        borderRadius: 4,
        backgroundColor: '#efefef',
        marginLeft: -1,
    },
    textField: {
        flex: 1,
    },
    noCards: {
        marginLeft: 15,
    },
    removeTableButton: {
        alignSelf: 'flex-end',
    },
};

class Table extends Component {
    state = {
        isCreatingCard: false,
        newCardText: '',
        isEditingTitle: false,
        titleInputValue: this.props.table.title,
    };

    handleAddButton = () => {
        this.setState({
            isCreatingCard: true,
        });
    };

    handleTextFieldChange = (ev) => {
        this.setState({
            newCardText: ev.target.value,
        });
    };

    handleCreateButton = (ev) => {
        ev.preventDefault();
        const { createCard, table } = this.props;
        if (!this.state.newCardText) return;

        const newCard = {
            desc: '',
            id: '',
            text: this.state.newCardText,
            tableId: table.id,
        };

        createCard(newCard);
        this.setState({
            newCardText: '',
            isCreatingCard: false,
        });
    };

    handleCancelButton = () => {
        this.setState({
            newCardText: '',
            isCreatingCard: false,
        });
    };

    handleEditTitleButton = () => {
        this.setState({ isEditingTitle: true });
    };

    handleConfirmTitle = (ev) => {
        ev.preventDefault();
        this.props.changeTitle(this.state.titleInputValue, this.props.table.id);
        this.setState({ isEditingTitle: false });
    };

    handeTitleInputChange = (ev) => {
        this.setState({
            titleInputValue: ev.target.value,
        });
    };

    handleRemoveTableButton = () => {
        this.props.removeTable(this.props.table.id);
    };

    getCards = () => {
        const { table, cardsState } = this.props;

        if (cardsState.length) {
            const cards = table.cardIds.map((cardId) =>
                cardsState.find((item) => item.id === cardId)
            );
            if (cards.length)
                return cards.map((item, index) => <Card key={item.id} card={item} index={index} />);
        }
        return <Typography className={this.props.classes.noCards}>No cards yet...</Typography>;
    };

    render() {
        const { classes, table, index } = this.props;
        const { isCreatingCard, isEditingTitle } = this.state;

        return (
            <Draggable draggableId={table.id} index={index}>
                {(provided) => (
                    <Paper
                        className={classes.table}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Container className={classes.title}>
                            {!isEditingTitle ? (
                                <Typography
                                    variant="h5"
                                    className={classes.titleText}
                                    onClick={this.handleEditTitleButton}
                                >
                                    {table.title}
                                </Typography>
                            ) : (
                                <form
                                    onSubmit={this.handleConfirmTitle}
                                    className={classes.editTitle}
                                >
                                    <InputBase
                                        autoFocus
                                        className={classes.titleInput}
                                        onChange={this.handeTitleInputChange}
                                        value={this.state.titleInputValue}
                                        inputProps={{ 'aria-label': 'naked' }}
                                    />
                                    <IconButton title="Confirm" onClick={this.handleConfirmTitle}>
                                        <CheckOutlinedIcon />
                                    </IconButton>
                                </form>
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

                                    {!isCreatingCard && (
                                        <IconButton
                                            onClick={this.handleAddButton}
                                            className={classes.createButton}
                                            title="Create new card"
                                        >
                                            <AddOutlinedIcon />
                                        </IconButton>
                                    )}
                                </List>
                            )}
                        </Droppable>

                        {isCreatingCard && (
                            <form className={classes.newCard} onSubmit={this.handleCreateButton}>
                                <TextField
                                    className={classes.textField}
                                    label="Title of the card"
                                    onChange={this.handleTextFieldChange}
                                    autoFocus
                                />

                                <IconButton onClick={this.handleCreateButton} title="Confirm">
                                    <AddOutlinedIcon />
                                </IconButton>

                                <IconButton onClick={this.handleCancelButton} title="Cancel">
                                    <ClearOutlinedIcon />
                                </IconButton>
                            </form>
                        )}

                        <IconButton
                            className={classes.removeTableButton}
                            onClick={this.handleRemoveTableButton}
                            title="Remove this table"
                        >
                            <DeleteForeverOutlinedIcon />
                        </IconButton>
                    </Paper>
                )}
            </Draggable>
        );
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
    removeTable: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
});

const mapDispatchToProps = {
    createCard: createCardAction,
    changeTitle: changeTitleAction,
    removeTable: removeTableAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table));
