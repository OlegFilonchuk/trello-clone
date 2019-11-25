import produce from 'immer';
// eslint-disable-next-line import/no-cycle
import { GLOBAL_DRAG_END } from './tablesReducer';

export const FETCH_CARDS = 'FETCH_CARDS';
export const CREATE_CARD = 'CREATE_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
const api = process.env.REACT_APP_API_URI;

export const fetchCardsAction = () => async (dispatch) => {
    const rawData = await fetch(`${api}/cards`);
    const cards = await rawData.json();
    dispatch({
        type: FETCH_CARDS,
        payload: {
            cards,
        },
    });
};

export const createCardAction = (newCard, cardIds) => (dispatch) => {
    fetch(`${api}/cards`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(newCard),
    });
    fetch(`${api}/tables/${newCard.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: cardIds.concat(newCard.id) }),
    });
    dispatch({
        type: CREATE_CARD,
        payload: {
            newCard,
        },
    });
};

export const removeCardAction = (card) => (dispatch, getState) => {
    const table = getState().tablesState.find((item) => item.id === card.tableId);
    const newCardIds = table.cardIds.filter((item) => item !== card.id);

    fetch(`${api}/cards/${card.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    });
    fetch(`${api}/tables/${card.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });
    dispatch({
        type: REMOVE_CARD,
        payload: {
            card,
            newCardIds,
        },
    });
};

export const cardsReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CARDS:
            payload.cards.forEach((item) => draft.push(item));
            break;

        case CREATE_CARD:
            draft.push(payload.newCard);
            break;

        case REMOVE_CARD:
            return draft.filter((item) => item.id !== payload.card.id);

        case GLOBAL_DRAG_END:
            draft.find((item) => item.id === payload.cardId).tableId = payload.finish.id;
            break;

        default:
            return draft;
    }
});
