import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Container, Typography, Button, TextField } from '@material-ui/core';
import { removeCardAction, changeDescAction } from '../../redux/reducers/cardsReducer';

const styles = {
    openCard: {
        display: 'flex',
        flexDirection: 'column',
    },
    removeCardButton: {
        alignSelf: 'flex-end',
    },
    description: {
        paddingTop: 30,
        paddingBottom: 30,
    },
};

class OpenCard extends Component {
    state = {
        isChangingDesc: false,
        descValue: this.props.card.desc,
    };

    handleRemoveButtonClick = () => {
        const { tablesState, removeCard, card } = this.props;
        const table = tablesState.find((item) => item.id === card.tableId);
        const newCardIds = table.cardIds.filter((item) => item !== card.id);
        removeCard(card, newCardIds);
    };

    handleDescClick = () => {
        this.setState({
            isChangingDesc: true,
        });
    };

    onDescInputChange = (ev) => {
        this.setState({
            descValue: ev.target.value,
        });
    };

    handleConfirmClick = (ev) => {
        const {
            changeDesc,
            card: { id },
        } = this.props;
        ev.preventDefault();
        changeDesc(this.state.descValue, id);
        this.setState({
            isChangingDesc: false,
        });
    };

    render() {
        const {
            classes,
            card: { text, tableId },
            tablesState,
        } = this.props;
        const { descValue, isChangingDesc } = this.state;

        return (
            <Container className={classes.openCard} onClick={(ev) => ev.stopPropagation()}>
                <Typography variant="h4" component="h2">
                    {text}
                </Typography>

                {!this.state.isChangingDesc ? (
                    <Typography
                        variant="body1"
                        className={classes.description}
                        onClick={this.handleDescClick}
                    >
                        {descValue || 'Add a description here...'}
                    </Typography>
                ) : (
                    <form>
                        <TextField
                            autoFocus
                            onChange={this.onDescInputChange}
                            multiline
                            fullWidth
                            rows={3}
                            variant="outlined"
                            placeholder="Write a description"
                        />
                        <Button type="submit" onClick={this.handleConfirmClick}>
                            Confirm
                        </Button>
                    </form>
                )}

                <Typography variant="body2">
                    This card belongs to
                    <b>{` "${tablesState.find((item) => item.id === tableId).title}" `}</b>
                    table
                </Typography>
                <Button
                    type="button"
                    size="small"
                    onClick={this.handleRemoveButtonClick}
                    className={classes.removeCardButton}
                >
                    remove it
                </Button>
            </Container>
        );
    }
}

OpenCard.propTypes = {
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
    }).isRequired,
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeCard: PropTypes.func.isRequired,
    changeDesc: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
});

const mapDispatchToProps = {
    removeCard: removeCardAction,
    changeDesc: changeDescAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OpenCard));
