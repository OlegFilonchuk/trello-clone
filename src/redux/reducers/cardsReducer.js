import produce from 'immer';
// eslint-disable-next-line import/no-cycle
import { GLOBAL_DRAG_END } from './tablesReducer';

export const FETCH_CARDS = 'FETCH_CARDS';
export const CREATE_CARD = 'CREATE_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
const api = process.env.REACT_APP_API_URI;

export const fetchCardsAction = () => async (dispatch) => {
    const rawRes = await fetch(`${api}/cards`);

    if (!rawRes.ok) return;

    const cards = await rawRes.json();

    dispatch({
        type: FETCH_CARDS,
        payload: {
            cards,
        },
    });
};

export const createCardAction = (newCard) => async (dispatch, getState) => {
    const rawRes1 = await fetch(`${api}/cards`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(newCard),
    });

    if (!rawRes1.ok) return;

    const newCardIds = getState()
        .tablesState.find((item) => item.id === newCard.tableId)
        .cardIds.concat(newCard.id);

    const rawRes2 = await fetch(`${api}/tables/${newCard.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });

    if (!rawRes2.ok) return;

    dispatch({
        type: CREATE_CARD,
        payload: {
            newCard,
        },
    });
};

export const removeCardAction = (card) => async (dispatch, getState) => {
    const rawRes1 = await fetch(`${api}/cards/${card.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    });

    if (!rawRes1.ok) return;

    const table = getState().tablesState.find((item) => item.id === card.tableId);
    const newCardIds = table.cardIds.filter((item) => item !== card.id);

    const rawRes2 = await fetch(`${api}/tables/${card.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });

    if (!rawRes2.ok) return;

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
