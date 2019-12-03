import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, makeStyles, TextField } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { validateCardText } from '../../restApiController';
import { createCardAction } from '../../redux/reducers/cardsReducer';

const useStyles = makeStyles({
    newCard: {
        display: 'flex',
        alignItems: 'center',
        padding: 12,
    },
});

const validate = (values) => {
    const errors = {};
    if (!values.cardText) {
        errors.cardText = 'Required';
    }
    return errors;
};

const renderField = ({ input, label, type, className, meta: { touched, error } }) => {
    return (
        <div>
            <TextField
                label={label}
                type={type}
                className={className}
                autoComplete="off"
                autoFocus
                {...input}
            />
            {touched && error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    );
};

const NewCardForm = (props) => {
    const { handleSubmit, table, pristine, reset } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isCreatingCard, toggleIsCreatingCard] = useState(false);

    const handleAddCard = () => toggleIsCreatingCard(true);

    const handleCancel = () => {
        reset();
        toggleIsCreatingCard(false);
    };

    const confirmTitle = async (values) => {
        if (!pristine) {
            await validateCardText(values);

            const newCard = {
                done: false,
                assigned: '',
                desc: '',
                id: '',
                text: values.cardText,
                tableId: table.id,
            };

            dispatch(createCardAction(newCard));
        }

        toggleIsCreatingCard(false);
    };

    return !isCreatingCard ? (
        <IconButton
            onClick={handleAddCard}
            className={classes.createButton}
            title="Create new card"
        >
            <AddOutlinedIcon />
        </IconButton>
    ) : (
        <form onSubmit={handleSubmit(confirmTitle)} className={classes.newCard}>
            <Field
                className={classes.titleInput}
                name="cardText"
                type="text"
                component={renderField}
                label="Title of the card"
            />

            <IconButton type="submit" title="Confirm">
                <AddOutlinedIcon />
            </IconButton>

            <IconButton onClick={handleCancel} title="Cancel">
                <ClearOutlinedIcon />
            </IconButton>
        </form>
    );
};

NewCardForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'newCard',
    validate,
})(NewCardForm);
