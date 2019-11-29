import React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';

const useStyles = makeStyles({
    doneForm: {
        paddingBottom: 30,
        display: 'flex',
        alignItems: 'center',
    },
});

const OpenCardDoneForm = (props) => {
    const { handleSubmit, handleCardDoneChange, checked } = props;
    const classes = useStyles();
    return (
        <form onSubmit={handleSubmit} className={classes.doneForm}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="openCardDone">Done</label>
            <Field
                name="openCardDone"
                type="checkbox"
                component="input"
                checked={checked}
                onChange={handleCardDoneChange}
            />
        </form>
    );
};

OpenCardDoneForm.propTypes = {
    handleCardDoneChange: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'openCardDone',
})(OpenCardDoneForm);
