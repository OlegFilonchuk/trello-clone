import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
    makeStyles,
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
import { selectTableById } from '../../selectors';

const useStyles = makeStyles({
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
});

const OpenCard = (props) => {
    const classes = useStyles();

    const [isChangingDesc, toggleIsChangingDesc] = useState(false);
    const [descValue, changeDescValue] = useState(props.card.desc);
    const [isChangingText, toggleIsChangingText] = useState(false);
    const [textValue, changeTextValue] = useState(props.card.text);

    const table = useSelector((state) => selectTableById(state, props.card.tableId));
    const dispatch = useDispatch();

    const handleRemoveButtonClick = () => {
        dispatch(removeCardAction(props.card));
    };

    const handleDescClick = () => {
        toggleIsChangingDesc(true);
    };

    const onDescInputChange = (ev) => {
        changeDescValue(ev.target.value);
    };

    const handleConfirmDescClick = (ev) => {
        ev.preventDefault();

        dispatch(changeDescAction(descValue, props.card.id));

        toggleIsChangingDesc(false);
    };

    const handleCancelDescClick = () => {
        toggleIsChangingDesc(false);
        changeDescValue(props.card.desc);
    };

    const handleTextClick = () => {
        toggleIsChangingText(true);
    };

    const onTextInputChange = (ev) => {
        changeTextValue(ev.target.value);
    };

    const handleConfirmTextClick = (ev) => {
        ev.preventDefault();

        dispatch(changeTextAction(textValue, props.card.id));
        toggleIsChangingText(false);
    };

    const {
        card: { text },
    } = props;

    return (
        <Container className={classes.openCard} onClick={(ev) => ev.stopPropagation()}>
            <Container className={classes.text}>
                {!isChangingText ? (
                    <Typography variant="h4" component="h2" onClick={handleTextClick}>
                        {text}
                    </Typography>
                ) : (
                    <form onSubmit={handleConfirmTextClick}>
                        <InputBase
                            autoFocus
                            className={classes.textInput}
                            onChange={onTextInputChange}
                            value={textValue}
                            inputProps={{ 'aria-label': 'naked' }}
                        />
                        <IconButton title="Confirm" onClick={handleConfirmTextClick}>
                            <CheckOutlinedIcon />
                        </IconButton>
                    </form>
                )}
            </Container>

            {!isChangingDesc ? (
                <Typography
                    variant="body1"
                    className={classes.description}
                    onClick={handleDescClick}
                    title="Click here to change"
                >
                    {descValue || 'Add a description here...'}
                </Typography>
            ) : (
                <form className={classes.descForm}>
                    <TextField
                        autoFocus
                        onChange={onDescInputChange}
                        value={descValue}
                        multiline
                        fullWidth
                        rows={3}
                        variant="outlined"
                        placeholder="Write a description"
                    />
                    <div className={classes.descButtonsCont}>
                        <Button type="submit" onClick={handleConfirmDescClick} color="primary">
                            Confirm
                        </Button>
                        <Button type="button" onClick={handleCancelDescClick} color="secondary">
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            <Typography variant="body2">
                This card belongs to
                <b>{` "${table.title}" `}</b>
                table
            </Typography>
            <Button
                type="button"
                size="small"
                onClick={handleRemoveButtonClick}
                className={classes.removeCardButton}
            >
                remove it
            </Button>
        </Container>
    );
};

OpenCard.propTypes = {
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
    }).isRequired,
};

export default OpenCard;
