import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    withStyles,
    Container,
    Typography,
    Button,
    TextField,
    InputBase,
    IconButton,
} from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import {
    removeCardAction,
    changeDescAction,
    changeTextAction,
} from '../../redux/reducers/cardsReducer';
import { selectTables } from '../../selectors';

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
        cursor: 'pointer',
    },
    descForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    descButtonsCont: {
        alignSelf: 'flex-start',
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        padding: 0,
    },
    textInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 400,
        lineHeight: 1.17,
    },
};

class OpenCard extends Component {
    state = {
        isChangingDesc: false,
        descValue: this.props.card.desc,
        isChangingText: false,
        textValue: this.props.card.text,
    };

    handleRemoveButtonClick = () => {
        const { tables, removeCard, card } = this.props;
        const table = tables.find((item) => item.id === card.tableId);
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

    handleConfirmDescClick = (ev) => {
        ev.preventDefault();
        const {
            changeDesc,
            card: { id },
        } = this.props;
        changeDesc(this.state.descValue, id);
        this.setState({
            isChangingDesc: false,
        });
    };

    handleCancelDescClick = () => {
        this.setState({
            isChangingDesc: false,
            descValue: this.props.card.desc,
        });
    };

    handleTextClick = () => {
        this.setState({
            isChangingText: true,
        });
    };

    onTextInputChange = (ev) => {
        this.setState({
            textValue: ev.target.value,
        });
    };

    handleConfirmTextClick = (ev) => {
        const {
            changeText,
            card: { id },
        } = this.props;
        ev.preventDefault();
        changeText(this.state.textValue, id);
        this.setState({
            isChangingText: false,
        });
    };

    handleCancelTextClick = () => {
        this.setState({
            isChangingText: false,
            textValue: this.props.card.text,
        });
    };

    render() {
        const {
            classes,
            card: { text, tableId },
            tables,
        } = this.props;
        const { descValue, isChangingDesc, isChangingText, textValue } = this.state;

        return (
            <Container className={classes.openCard} onClick={(ev) => ev.stopPropagation()}>
                <Container className={classes.text}>
                    {!isChangingText ? (
                        <Typography variant="h4" component="h2" onClick={this.handleTextClick}>
                            {text}
                        </Typography>
                    ) : (
                        <form onSubmit={this.handleConfirmTextClick}>
                            <InputBase
                                autoFocus
                                className={classes.textInput}
                                onChange={this.onTextInputChange}
                                value={textValue}
                                inputProps={{ 'aria-label': 'naked' }}
                            />
                            <IconButton title="Confirm" onClick={this.handleConfirmTextClick}>
                                <CheckOutlinedIcon />
                            </IconButton>
                        </form>
                    )}
                </Container>

                {!isChangingDesc ? (
                    <Typography
                        variant="body1"
                        className={classes.description}
                        onClick={this.handleDescClick}
                        title="Click here to change"
                    >
                        {descValue || 'Add a description here...'}
                    </Typography>
                ) : (
                    <form className={classes.descForm}>
                        <TextField
                            autoFocus
                            onChange={this.onDescInputChange}
                            value={descValue}
                            multiline
                            fullWidth
                            rows={3}
                            variant="outlined"
                            placeholder="Write a description"
                        />
                        <div className={classes.descButtonsCont}>
                            <Button
                                type="submit"
                                onClick={this.handleConfirmDescClick}
                                color="primary"
                            >
                                Confirm
                            </Button>
                            <Button
                                type="button"
                                onClick={this.handleCancelDescClick}
                                color="secondary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                <Typography variant="body2">
                    This card belongs to
                    <b>{` "${tables.find((item) => item.id === tableId).title}" `}</b>
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
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeCard: PropTypes.func.isRequired,
    changeDesc: PropTypes.func.isRequired,
    changeText: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
    tables: selectTables(state),
});

const mapDispatchToProps = {
    removeCard: removeCardAction,
    changeDesc: changeDescAction,
    changeText: changeTextAction,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(OpenCard));
