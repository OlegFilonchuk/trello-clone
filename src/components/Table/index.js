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
import { changeTitleAction } from '../../redux/reducers/tablesReducer';
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
        marginLeft: 10,
    },
    title: {
        display: 'flex',
        alignItems: 'center',
    },
    titleText: {
        flex: 1,
        cursor: 'pointer',
        paddingTop: 7,
        paddingBottom: 7,
    },
    editTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
    },
    titleInput: {
        flex: 1,
        fontSize: '2.125rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1.17,
    },
    textField: {
        flex: 1,
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
            id: Math.random()
                .toString(36)
                .substring(2, 15),
            text: this.state.newCardText,
            tableId: table.id,
        };

        createCard(newCard, table.cardIds);
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

    getCards = () => {
        const { table, cardsState } = this.props;

        if (cardsState.length) {
            const cards = table.cardIds.map((cardId) =>
                cardsState.find((item) => item.id === cardId)
            );
            if (cards.length)
                return cards.map((item, index) => <Card key={item.id} card={item} index={index} />);
        }
        return <Typography>No cards yet...</Typography>;
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
                            {!isEditingTitle && (
                                <Typography
                                    variant="h4"
                                    className={classes.titleText}
                                    onClick={this.handleEditTitleButton}
                                >
                                    {table.title}
                                </Typography>
                            )}

                            {isEditingTitle && (
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
                                </List>
                            )}
                        </Droppable>

                        {!isCreatingCard && (
                            <IconButton
                                onClick={this.handleAddButton}
                                className={classes.createButton}
                                title="Create new card"
                            >
                                <AddOutlinedIcon />
                            </IconButton>
                        )}

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
    index: PropTypes.number.isRequired,
};

const mapStateToProps = ({ cardsState }) => ({
    cardsState,
});

const mapDispatchToProps = {
    createCard: createCardAction,
    changeTitle: changeTitleAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table));
