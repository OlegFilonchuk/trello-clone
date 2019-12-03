import React from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, makeStyles } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { validateAssigned } from '../../../restApiController';

const useStyles = makeStyles({
    assignedForm: {
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

const renderField = ({ assigned, input, className, meta: { error } }) => {
    const getOptions = () =>
        assigned.map((item) => (
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

const OpenCardAssignedForm = (props) => {
    const { error, handleSubmit, onAssignedChange, handleAssignedSubmit, assigned } = props;
    const classes = useStyles();

    const confirmAssigned = async (values) => {
        await validateAssigned(values);
        handleAssignedSubmit();
    };

    return (
        <form onSubmit={handleSubmit(confirmAssigned)}>
            <div className={classes.assignedForm}>
                <Field
                    type="select"
                    className={classes.select}
                    name="assigned"
                    component={renderField}
                    onChange={onAssignedChange}
                    assigned={assigned}
                />
                <IconButton title="Confirm" type="submit">
                    <CheckOutlinedIcon />
                </IconButton>
            </div>
            <div>{error}</div>
        </form>
    );
};

OpenCardAssignedForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onAssignedChange: PropTypes.func.isRequired,
    handleAssignedSubmit: PropTypes.func.isRequired,
    assigned: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default reduxForm({
    form: 'openCardAssigned',
})(OpenCardAssignedForm);
