import React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, makeStyles, TextField } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { Field, reduxForm } from 'redux-form';
import { validateCardTitle } from '../../../restApiController';

const useStyles = makeStyles({
    newCard: {
        display: 'flex',
        alignItems: 'center',
        padding: 12,
    },
});

const validate = (values) => {
    const errors = {};
    if (!values.cardTitle) {
        errors.cardTitle = 'Required';
    }
    return errors;
};

// eslint-disable-next-line react/prop-types
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
    const { handleSubmit, handleCardTitleChange, handleCancelButton, handleConfirmNewCard } = props;
    const classes = useStyles();

    const confirmTitle = async (values) => {
        await validateCardTitle(values);
        await handleConfirmNewCard();
    };

    return (
        <form onSubmit={handleSubmit(confirmTitle)} className={classes.newCard}>
            <Field
                className={classes.titleInput}
                onChange={handleCardTitleChange}
                name="cardTitle"
                type="text"
                component={renderField}
                label="Title of the card"
            />

            <IconButton type="submit" title="Confirm">
                <AddOutlinedIcon />
            </IconButton>

            <IconButton onClick={handleCancelButton} title="Cancel">
                <ClearOutlinedIcon />
            </IconButton>
        </form>
    );
};

NewCardForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleCardTitleChange: PropTypes.func.isRequired,
    handleCancelButton: PropTypes.func.isRequired,
    handleConfirmNewCard: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'newCard',
    validate,
})(NewCardForm);
