import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Container, Typography, IconButton } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { removeCardAction, changeDoneAction } from '../../redux/reducers/cardsReducer';
import { selectTableById } from '../../redux/selectors';
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
    item: {
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

    const classes = useStyles();
    const dispatch = useDispatch();

    const [isCardDone, toggleIsCardDone] = useState(card.done);

    const table = useSelector((state) => selectTableById(state, { tableId: card.tableId }));

    const handleRemoveButtonClick = () => dispatch(removeCardAction(card));

    const handleCardDoneChange = (ev) => {
        dispatch(changeDoneAction(ev.target.checked, card.id));
        toggleIsCardDone(ev.target.checked);
    };

    return (
        <Container className={classes.openCard} onClick={(ev) => ev.stopPropagation()}>
            <Typography variant="caption">Title</Typography>

            <div className={classes.item}>
                <OpenCardTextForm
                    card={card}
                    initialValues={{
                        cardText: card.text,
                    }}
                />
            </div>

            <Typography variant="caption">Description</Typography>

            <div className={classes.item}>
                <OpenCardDescriptionForm
                    card={card}
                    initialValues={{
                        openCardDescription: card.desc,
                    }}
                />
            </div>

            <Typography variant="caption">Assigned</Typography>
            <div className={classes.item}>
                <OpenCardAssignedForm
                    card={card}
                    initialValues={{
                        assigned: card.assigned,
                    }}
                />
            </div>

            <ReduxOpenCardDoneForm
                initialValues={{
                    openCardDone: isCardDone,
                }}
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
