import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, Container, Typography, Button } from '@material-ui/core';
import { removeCardAction } from '../../redux/reducers/cardsReducer';

const useStyles = makeStyles({
    openCard: {
        display: 'flex',
        flexDirection: 'column',
    },
    removeCardButton: {
        alignSelf: 'flex-end',
    },
    body: {
        paddingTop: 30,
        paddingBottom: 30,
    },
});

const OpenCard = (props) => {
    const {
        card: { id, text, tableId },
        tablesState,
        removeCard,
    } = props;

    const classes = useStyles(props);

    const handleRemoveButtonClick = () => {
        const table = tablesState.find((item) => item.id === tableId);
        const newCardIds = table.cardIds.filter((item) => item !== id);
        removeCard(props.card, newCardIds);
    };

    return (
        <Container className={classes.openCard}>
            <Typography variant="h2" component="h2">
                {text}
            </Typography>
            <Typography variant="body1" className={classes.body}>
                Here the card body comes
            </Typography>
            <Typography variant="body2">
                This card belongs to
                <b>{` "${tablesState.find((item) => item.id === tableId).title}" `}</b>
                table
            </Typography>
            <Button
                type="button"
                size="small"
                onClick={handleRemoveButtonClick}
                className={classes.removeCardButton}
            >
                remove it
            </Button>
        </Container>
    );
};

OpenCard.propTypes = {
    card: PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        tableId: PropTypes.string.isRequired,
    }).isRequired,
    tablesState: PropTypes.arrayOf(PropTypes.object).isRequired,
    removeCard: PropTypes.func.isRequired,
};

const mapStateToProps = ({ tablesState }) => ({
    tablesState,
});

const mapDispatchToProps = {
    removeCard: removeCardAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenCard);
