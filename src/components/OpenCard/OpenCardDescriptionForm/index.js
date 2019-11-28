import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';

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

// eslint-disable-next-line react/prop-types
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
    const { handleSubmit, onDescInputChange, handleCancelDesc } = props;
    const classes = useStyles();
    return (
        <form onSubmit={handleSubmit} className={classes.openCardDescForm}>
            <Field
                className={classes.input}
                onChange={onDescInputChange}
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
    handleCancelDesc: PropTypes.func.isRequired,
    onDescInputChange: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        openCardDescription: PropTypes.string.isRequired,
    }).isRequired,
};

export default reduxForm({
    form: 'openCardDescription',
})(OpenCardDescriptionForm);
