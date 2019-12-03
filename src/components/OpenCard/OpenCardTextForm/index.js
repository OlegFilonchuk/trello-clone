import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, InputBase, makeStyles, Typography } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { validateCardText } from '../../../restApiController';
import { changeTextAction } from '../../../redux/reducers/cardsReducer';

const useStyles = makeStyles({
    input: {
        flex: 1,
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.17,
    },
    openCardTextForm: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'flex-start',
    },
    text: {
        paddingTop: 7,
        paddingBottom: 7,
    },
});

const validate = (values) => {
    const errors = {};
    if (!values.cardText) {
        errors.cardText = 'Required';
    }
    return errors;
};

const renderField = ({ input, type, className, meta: { error } }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InputBase
                type={type}
                className={className}
                autoFocus
                autoComplete="off"
                inputProps={{ 'aria-label': 'naked' }}
                {...input}
            />
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    );
};

const OpenCardTextForm = (props) => {
    const { handleSubmit, card, pristine } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isChangingText, toggleIsChangingText] = useState(false);

    const handleTextClick = () => toggleIsChangingText(true);

    const confirmText = async (values) => {
        if (!pristine) {
            await validateCardText(values);
            dispatch(changeTextAction(values.cardText, card.id));
        }

        toggleIsChangingText(false);
    };

    return !isChangingText ? (
        <Typography variant="h4" component="h2" onClick={handleTextClick} className={classes.text}>
            {card.text}
        </Typography>
    ) : (
        <form onSubmit={handleSubmit(confirmText)} className={classes.openCardTextForm}>
            <Field className={classes.input} name="cardText" type="text" component={renderField} />
            <IconButton title="Confirm" type="submit">
                <CheckOutlinedIcon />
            </IconButton>
        </form>
    );
};

OpenCardTextForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        cardText: PropTypes.string.isRequired,
    }).isRequired,
};

export default reduxForm({
    form: 'openCardText',
    validate,
})(OpenCardTextForm);
