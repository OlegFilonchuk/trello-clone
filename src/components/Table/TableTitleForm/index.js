import React, { useState } from 'react';
import { IconButton, InputBase, makeStyles, Typography } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { useDispatch } from 'react-redux';
import { changeTitleAction } from '../../../redux/reducers/tablesReducer';

const useStyles = makeStyles({
    editTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'flex-start',
    },
    titleInput: {
        flex: 1,
        fontSize: 24,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1.17,
        border: '1px solid grey',
        borderRadius: 4,
        backgroundColor: '#efefef',
        margin: -1,
    },
});

const validate = (values) => {
    const errors = {};
    if (!values.tableTitle) {
        errors.tableTitle = 'Required';
    } else if (values.tableTitle.length < 3) {
        errors.tableTitle = 'Must be 3 characters or more';
    }
    return errors;
};

const renderField = ({ input, type, className, meta: { error } }) => {
    return (
        <div>
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

const TableTitleForm = (props) => {
    const { handleSubmit, table, pristine, toggleIsEditingTitle } = props;

    const classes = useStyles();
    const dispatch = useDispatch();

    const handleConfirmTitle = (values) => {
        if (!pristine) {
            dispatch(changeTitleAction(values.tableTitle, table.id));
        }
        toggleIsEditingTitle(false);
    };

    return (
        <form onSubmit={handleSubmit(handleConfirmTitle)} className={classes.editTitle}>
            <Field
                className={classes.titleInput}
                name="tableTitle"
                type="text"
                component={renderField}
            />
            <IconButton title="Confirm" type="submit">
                <CheckOutlinedIcon />
            </IconButton>
        </form>
    );
};

TableTitleForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        tableTitle: PropTypes.string.isRequired,
    }).isRequired,
};

export default reduxForm({
    form: 'tableTitle',
    validate,
    // enableReinitialize: true,
})(TableTitleForm);
