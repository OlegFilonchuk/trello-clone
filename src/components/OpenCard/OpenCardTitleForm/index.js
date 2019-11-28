import React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, InputBase, makeStyles } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { validateCardTitle } from '../../../restApiController';

const useStyles = makeStyles({
    input: {
        flex: 1,
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.17,
    },
    openCardTitleForm: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'flex-start',
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

const OpenCardTitleForm = (props) => {
    const { handleSubmit, onTextInputChange, handleConfirmText } = props;
    const classes = useStyles();

    const confirmTitle = async (values) => {
        await validateCardTitle(values);
        await handleConfirmText();
    };

    return (
        <form onSubmit={handleSubmit(confirmTitle)} className={classes.openCardTitleForm}>
            <Field
                className={classes.input}
                onChange={onTextInputChange}
                name="cardTitle"
                type="text"
                component={renderField}
            />
            <IconButton title="Confirm" type="submit">
                <CheckOutlinedIcon />
            </IconButton>
        </form>
    );
};

OpenCardTitleForm.propTypes = {
    handleConfirmText: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onTextInputChange: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        cardTitle: PropTypes.string.isRequired,
    }).isRequired,
};

export default reduxForm({
    form: 'openCardTitle',
    validate,
})(OpenCardTitleForm);
