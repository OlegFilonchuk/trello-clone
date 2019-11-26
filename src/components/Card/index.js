import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Card as MaterialCard,
    CardContent,
    Typography,
    withStyles,
    CardActions,
    Modal,
    Paper,
    IconButton,
} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { removeCardAction } from '../../redux/reducers/cardsReducer';
import OpenCard from '../OpenCard';
import { selectTables } from '../../selectors';

const styles = {
    card: {
        cursor: 'pointer !important',
        marginBottom: 10,
        backgroundColor: '#fffffe',
        display: 'flex',
        flexDirection: 'row',
        '&:hover .trial': {
            display: 'flex',
        },
    },
    content: {
        flex: 1,
    },
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        boxShadow: '1px 1px 1px 1px lightgrey',
        borderRadius: 4,
        outline: 0,
        padding: 10,
        backgroundColor: '#fff',
    },
    remove: {
        transition: 'opacity .2s ease-in-out',
    },
};

class Card extends Component {
    state = {
        isOpen: false,
        isMouseOverCard: false,
    };

    handleCardClick = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    handleRemoveCardButton = (ev) => {
        ev.stopPropagation();
        const { card, removeCard } = this.props;
        removeCard(card);
    };

    handleMouseOver = () => {
        this.setState({
            isMouseOverCard: true,
        });
    };

    handleMouseOut = () => {
        this.setState({
            isMouseOverCard: false,
        });
    };

    render() {
        const {
            index,
            card: { id, text },
            classes,
        } = this.props;

        const { isMouseOverCard } = this.state;

        return (
            <Draggable draggableId={id} index={index}>
                {(provided) => (
                    <MaterialCard
                        onClick={this.handleCardClick}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        className={classes.card}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                    >
                        <CardContent className={classes.content}>
                            <Typography>{text}</Typography>
                        </CardContent>
                        <CardActions>
                            <IconButton
                                className={classes.remove}
                                style={{ opacity: +isMouseOverCard }}
                                onClick={this.handleRemoveCardButton}
                                size="small"
                                title="Remove card"
                            >
                                <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                        <Modal
                            open={this.state.isOpen}
                            onClose={this.handleClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <Paper className={classes.paper}>
                                <OpenCard card={this.props.card} />
                            </Paper>
                        </Modal>
                    </MaterialCard>
                )}
            </Draggable>
        );
    }
}

Card.propTypes = {
    index: PropTypes.number.isRequired,
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
    }).isRequired,
    removeCard: PropTypes.func.isRequired,
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
    tables: selectTables(state),
});

const mapDispatchToProps = {
    removeCard: removeCardAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Card));
