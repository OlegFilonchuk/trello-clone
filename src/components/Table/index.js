import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, withStyles, List, Container, IconButton, Paper } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import ReduxTableTitleForm from './TableTitleForm';
import { changeTitleAction, removeTableAction } from '../../redux/reducers/tablesReducer';
import { createCardAction } from '../../redux/reducers/cardsReducer';
import { selectCardsForTable } from '../../redux/selectors';
import Card from '../Card';
import NewCardForm from './NewCardForm';

const styles = {
    table: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ededed',
        padding: 10,
        margin: 5,
        minWidth: 300,
    },
    list: {
        flexGrow: 1,
        padding: 10,
    },

    createButton: {
        alignSelf: 'flex-start',
    },
    title: {
        display: 'flex',
        alignItems: 'flex-start',
        height: 70,
    },
    titleText: {
        flex: 1,
        cursor: 'pointer',
        paddingTop: 9,
        paddingBottom: 8,
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

/**
 * Representing a table
 */
class Table extends Component {
    state = {
        isCreatingCard: false,
        newCardText: '',
        isEditingTitle: false,
        titleInputValue: this.props.table.title,
    };

    handleAddTable = () => {
        this.setState({
            isCreatingCard: true,
        });
    };

    handleTextFieldChange = (ev) => {
        this.setState({
            newCardText: ev.target.value,
        });
    };

    handleConfirmNewCard = () => {
        const { createCard, table } = this.props;

        if (!this.state.newCardText) return;

        const newCard = {
            done: false,
            assigned: '',
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

    handleCancel = () => {
        this.setState({
            newCardText: '',
            isCreatingCard: false,
        });
    };

    handleEditTitleButton = () => {
        this.setState({ isEditingTitle: true });
    };

    handleConfirmTitle = () => {
        this.props.changeTitle(this.state.titleInputValue, this.props.table.id);
        this.setState({ isEditingTitle: false });
    };

    handleTitleInputChange = (ev) => {
        this.setState({
            titleInputValue: ev.target.value,
        });
    };

    handleRemoveTable = () => {
        this.props.removeTable(this.props.table.id);
    };

    /**
     * gets a list of cards
     * @returns {(Array.<Card>|HTMLElement)}
     */
    getCards = () => {
        const { cards } = this.props;

        return cards.length ? (
            cards.map((item, index) => <Card key={item.id} card={item} index={index} />)
        ) : (
            <Typography className={this.props.classes.noCards}>No cards yet...</Typography>
        );
    };

    render() {
        const { classes, table, index } = this.props;
        const { isCreatingCard, isEditingTitle, titleInputValue } = this.state;

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
                                <ReduxTableTitleForm
                                    onSubmit={this.handleConfirmTitle}
                                    handleTitleInputChange={this.handleTitleInputChange}
                                    initialValues={{
                                        tableTitle: titleInputValue,
                                    }}
                                />
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

                                    {!isCreatingCard ? (
                                        <IconButton
                                            onClick={this.handleAddTable}
                                            className={classes.createButton}
                                            title="Create new card"
                                        >
                                            <AddOutlinedIcon />
                                        </IconButton>
                                    ) : (
                                        <NewCardForm
                                            onSubmit={this.handleConfirmNewCard}
                                            handleConfirmNewCard={this.handleConfirmNewCard}
                                            handleCardTitleChange={this.handleTextFieldChange}
                                            handleCancelButton={this.handleCancel}
                                        />
                                    )}
                                </List>
                            )}
                        </Droppable>

                        <IconButton
                            className={classes.removeTableButton}
                            onClick={this.handleRemoveTable}
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
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    createCard: PropTypes.func.isRequired,
    changeTitle: PropTypes.func.isRequired,
    removeTable: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    cards: selectCardsForTable(state, ownProps.table.cardIds),
});

const mapDispatchToProps = {
    createCard: createCardAction,
    changeTitle: changeTitleAction,
    removeTable: removeTableAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table));
