import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { changeDescAction } from '../../../redux/reducers/cardsReducer';

const useStyles = makeStyles({
    input: {
        flex: 1,
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.17,
    },
    openCardDescForm: {
        display: 'flex',
        flexDirection: 'column',
        flexFlow: 'row nowrap',
        alignItems: 'flex-start',
    },
});

const renderField = ({ input, type, className }) => {
    return (
        <TextField
            type={type}
            className={className}
            autoFocus
            multiline
            fullWidth
            rows={3}
            autoComplete="off"
            variant="outlined"
            placeholder="Write a description"
            inputProps={{ 'aria-label': 'naked' }}
            {...input}
        />
    );
};

const OpenCardDescriptionForm = (props) => {
    const { handleSubmit, card, pristine, reset } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isChangingDesc, toggleIsChangingDesc] = useState(false);

    const handleDescClick = () => toggleIsChangingDesc(true);

    const confirmDesc = (values) => {
        if (!pristine) {
            dispatch(changeDescAction(values.openCardDescription, card.id));
        }
        toggleIsChangingDesc(false);
    };

    const handleCancelDesc = () => {
        reset();
        toggleIsChangingDesc(false);
    };

    return !isChangingDesc ? (
        <Typography variant="body1" onClick={handleDescClick} title="Click here to change">
            {card.desc || 'Add a description here...'}
        </Typography>
    ) : (
        <form onSubmit={handleSubmit(confirmDesc)} className={classes.openCardDescForm}>
            <Field
                className={classes.input}
                name="openCardDescription"
                type="text"
                component={renderField}
            />
            <div>
                <Button type="submit" variant="contained">
                    Confirm
                </Button>
                <Button type="button" onClick={handleCancelDesc} variant="contained">
                    Cancel
                </Button>
            </div>
        </form>
    );
};

OpenCardDescriptionForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        openCardDescription: PropTypes.string.isRequired,
    }).isRequired,
};

export default reduxForm({
    form: 'openCardDescriptionForm',
})(OpenCardDescriptionForm);
