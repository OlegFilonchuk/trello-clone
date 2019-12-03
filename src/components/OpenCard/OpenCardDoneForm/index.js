import React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles, Checkbox } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';

const useStyles = makeStyles({
    doneForm: {
        paddingBottom: 30,
        display: 'flex',
        alignItems: 'center',
    },
});

const renderCheckbox = ({ input }) => (
    <Checkbox checked={!!input.value} onChange={input.onChange} />
);

const OpenCardDoneForm = (props) => {
    const { handleSubmit, handleCardDoneChange } = props;
    const classes = useStyles();
    return (
        <form onSubmit={handleSubmit} className={classes.doneForm}>
            <label htmlFor="openCardDone">Done</label>
            <Field name="openCardDone" component={renderCheckbox} onChange={handleCardDoneChange} />
        </form>
    );
};

OpenCardDoneForm.propTypes = {
    handleCardDoneChange: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'openCardDoneForm',
})(OpenCardDoneForm);
