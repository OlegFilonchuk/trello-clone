import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
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
import { compose } from 'redux';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { removeCardAction } from '../redux/reducers/cardsReducer';
import OpenCard from './OpenCard';

const styles = {
    card: {
        cursor: 'pointer !important',
        marginBottom: 10,
        backgroundColor: '#fffffe',
        display: 'flex',
        flexDirection: 'row',
        '&:hover $remove': {
            opacity: 1,
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
        minWidth: 533,
        boxShadow: '1px 1px 1px 1px lightgrey',
        borderRadius: 4,
        outline: 0,
        padding: 10,
        backgroundColor: '#fff',
    },
    remove: {
        opacity: 0,
        transition: 'opacity .2s ease-in-out',
    },
};

/**
 * representing a card
 */
class Card extends Component {
    state = {
        isOpen: false,
    };

    handleCardClick = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    handleRemoveCard = (ev) => {
        const { card, removeCard } = this.props;
        ev.stopPropagation();
        removeCard(card);
    };

    render() {
        const {
            index,
            card: { id, text },
            classes,
        } = this.props;

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
                        <CardActions>
                            <IconButton
                                className={classes.remove}
                                onClick={this.handleRemoveCard}
                                size="small"
                                title="Remove card"
                            >
                                <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                        <Modal open={this.state.isOpen} onClose={this.handleClose}>
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
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapDispatchToProps = {
    removeCard: removeCardAction,
};

export default compose(withStyles(styles), connect(null, mapDispatchToProps))(Card);
