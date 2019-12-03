import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Container, Typography, IconButton } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {
    removeCardAction,
    changeDescAction,
    changeAssignedAction,
    changeDoneAction,
} from '../../redux/reducers/cardsReducer';
import { selectAllAssigned, selectTableById } from '../../redux/selectors';
import OpenCardTextForm from './OpenCardTextForm';
import OpenCardDescriptionForm from './OpenCardDescriptionForm';
import OpenCardAssignedForm from './OpenCardAssignedForm';
import ReduxOpenCardDoneForm from './OpenCardDoneForm';

const useStyles = makeStyles({
    openCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
    },
    description: {
        cursor: 'pointer',
        paddingBottom: 30,
    },
    title: {
        paddingBottom: 30,
    },
    assigned: {
        cursor: 'pointer',
        paddingBottom: 30,
    },
    footer: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    footerText: {
        flex: 1,
    },
});

/**
 * representing an openCard
 * @param props
 * @constructor
 */
const OpenCard = (props) => {
    const { card } = props;

    const dispatch = useDispatch();

    const classes = useStyles();

    const [isChangingDesc, toggleIsChangingDesc] = useState(false);
    const [descValue, changeDescValue] = useState(card.desc);

    const [isChangingAssigned, toggleIsChangingAssigned] = useState(false);
    const [assignedValue, changeAssignedValue] = useState(card.assigned);

    const [isCardDone, toggleIsCardDone] = useState(card.done);

    const table = useSelector((state) => selectTableById(state, { tableId: card.tableId }));
    const assigned = useSelector(selectAllAssigned);

    const handleRemoveButtonClick = () => dispatch(removeCardAction(card));

    const handleDescClick = () => toggleIsChangingDesc(true);

    const onDescInputChange = (ev) => changeDescValue(ev.target.value);

    const handleConfirmDesc = () => {
        dispatch(changeDescAction(descValue, card.id));
        toggleIsChangingDesc(false);
    };

    const handleCancelDesc = () => {
        toggleIsChangingDesc(false);
        changeDescValue(card.desc);
    };

    const handleAssignedClick = () => toggleIsChangingAssigned(true);

    const onAssignedChange = (ev) => changeAssignedValue(ev.target.value);

    const handleAssignedSubmit = () => {
        dispatch(changeAssignedAction(assignedValue, card.id));
        toggleIsChangingAssigned(false);
    };

    const handleCardDoneChange = async (ev) => {
        await toggleIsCardDone(ev.target.checked);
        await dispatch(changeDoneAction(ev.target.checked, card.id));
    };

    return (
        <Container className={classes.openCard} onClick={(ev) => ev.stopPropagation()}>
            <Typography variant="caption">Title</Typography>

            <div className={classes.title}>
                <OpenCardTextForm
                    card={card}
                    initialValues={{
                        cardText: card.text,
                    }}
                />
            </div>

            <Typography variant="caption">Description</Typography>
            <div className={classes.description}>
                {!isChangingDesc ? (
                    <Typography
                        variant="body1"
                        onClick={handleDescClick}
                        title="Click here to change"
                    >
                        {descValue || 'Add a description here...'}
                    </Typography>
                ) : (
                    <OpenCardDescriptionForm
                        card={card}
                        onSubmit={handleConfirmDesc}
                        initialValues={{
                            openCardDescription: descValue,
                        }}
                        onDescInputChange={onDescInputChange}
                        handleCancelDesc={handleCancelDesc}
                    />
                )}
            </div>

            <Typography variant="caption">Assigned</Typography>
            <div className={classes.assigned}>
                {!isChangingAssigned ? (
                    <Typography
                        variant="subtitle1"
                        onClick={handleAssignedClick}
                        title="Click here to change"
                    >
                        {assignedValue
                            ? assigned.find((item) => item.id === assignedValue).name
                            : 'Nobody yet...'}
                    </Typography>
                ) : (
                    <OpenCardAssignedForm
                        assigned={assigned}
                        onSubmit={handleAssignedSubmit}
                        onAssignedChange={onAssignedChange}
                        handleAssignedSubmit={handleAssignedSubmit}
                        initialValues={{
                            openCardAssigned: assignedValue,
                        }}
                    />
                )}
            </div>

            <ReduxOpenCardDoneForm
                checked={isCardDone}
                handleCardDoneChange={handleCardDoneChange}
            />

            <div className={classes.footer}>
                <Typography variant="body2" className={classes.footerText}>
                    This card belongs to
                    <b>{` "${table.title}" `}</b>
                    table
                </Typography>

                <IconButton onClick={handleRemoveButtonClick}>
                    <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
            </div>
        </Container>
    );
};

OpenCard.propTypes = {
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
        desc: PropTypes.string.isRequired,
    }).isRequired,
};

export default OpenCard;
