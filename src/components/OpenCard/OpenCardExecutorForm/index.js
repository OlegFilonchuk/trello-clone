import React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, makeStyles } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { validateExecutor } from '../../../restApiController';

const useStyles = makeStyles({
    executorForm: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
    },
    select: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
});

const renderField = ({ executors, input, className, meta: { error } }) => {
    const getOptions = () =>
        executors.map((item) => (
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        ));

    return (
        <div className={className}>
            <select autoComplete="off" {...input} style={{ height: 50 }}>
                {getOptions()}
            </select>
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    );
};

const OpenCardExecutorForm = (props) => {
    const { error, handleSubmit, onExecutorChange, handleExecutorSubmit, executors } = props;
    const classes = useStyles();

    const confirmExecutor = async (values) => {
        await validateExecutor(values);
        handleExecutorSubmit();
    };

    return (
        <form onSubmit={handleSubmit(confirmExecutor)}>
            <div className={classes.executorForm}>
                <Field
                    type="select"
                    className={classes.select}
                    name="executor"
                    component={renderField}
                    onChange={onExecutorChange}
                    executors={executors}
                />
                <IconButton title="Confirm" type="submit">
                    <CheckOutlinedIcon />
                </IconButton>
            </div>
            <div>{error}</div>
        </form>
    );
};

OpenCardExecutorForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onExecutorChange: PropTypes.func.isRequired,
    handleExecutorSubmit: PropTypes.func.isRequired,
    executors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default reduxForm({
    form: 'openCardExecutor',
})(OpenCardExecutorForm);
