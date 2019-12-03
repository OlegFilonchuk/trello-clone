import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, makeStyles, Typography, Select } from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Field, reduxForm } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { validateAssigned } from '../../restApiController';
import { changeAssignedAction } from '../../redux/reducers/cardsReducer';
import { selectAllAssigned } from '../../redux/selectors';

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

const renderField = ({ assigned, input, className, meta: { error }, children, ...custom }) => {
    return (
        <div className={className}>
            <Select native autoComplete="off" {...input} {...custom}>
                {children}
            </Select>
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
    );
};

const OpenCardAssignedForm = (props) => {
    const { error, handleSubmit, card, pristine } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const assigned = useSelector(selectAllAssigned);

    const [isChangingAssigned, toggleIsChangingAssigned] = useState(false);

    const handleAssignedClick = () => toggleIsChangingAssigned(true);

    const confirmAssigned = async (values) => {
        if (!pristine) {
            await validateAssigned(values);
            dispatch(changeAssignedAction(values.assigned, card.id));
        }
        toggleIsChangingAssigned(false);
    };

    const renderOptions = () =>
        assigned.map((item) => (
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        ));

    return !isChangingAssigned ? (
        <Typography
            variant="subtitle1"
            onClick={handleAssignedClick}
            title="Click here to change"
            style={{ height: 48 }}
        >
            {card.assigned
                ? assigned.find((item) => item.id === card.assigned).name
                : 'Nobody yet...'}
        </Typography>
    ) : (
        <form onSubmit={handleSubmit(confirmAssigned)}>
            <div className={classes.assignedForm}>
                <Field
                    type="select"
                    className={classes.select}
                    name="assigned"
                    component={renderField}
                    assigned={assigned}
                >
                    {renderOptions()}
                </Field>
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
};

export default reduxForm({
    form: 'openCardAssigned',
})(OpenCardAssignedForm);
