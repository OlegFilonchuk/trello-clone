import produce from 'immer';
// eslint-disable-next-line import/no-cycle
import { CREATE_CARD, REMOVE_CARD } from './cardsReducer';

export const FETCH_TABLES = 'FETCH_TABLES';
export const LOCAL_DRAG_END = 'LOCAL_DRAG_END';
export const GLOBAL_DRAG_END = 'GLOBAL_DRAG_END';
export const CHANGE_TITLE = 'CHANGE_TITLE';
export const CREATE_TABLE = 'CREATE_TABLE';

const api = process.env.REACT_APP_API_URI;

export const fetchTablesAction = () => async (dispatch) => {
    const rawData = await fetch(`${api}/tables`);
    const tables = await rawData.json();
    dispatch({
        type: FETCH_TABLES,
        tables,
    });
};

export const localDragEndAction = (tableId, newCardIds) => (dispatch, getState) => {
    console.log(getState());
    fetch(`${api}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });
    dispatch({
        type: LOCAL_DRAG_END,
        tableId,
        newCardIds,
    });
};

export const globalDragEndAction = (start, finish, cardId) => (dispatch) => {
    fetch(`${api}/tables/${start.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: start.cardIds }),
    });
    fetch(`${api}/tables/${finish.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: finish.cardIds }),
    });
    fetch(`${api}/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ tableId: finish.id }),
    });
    dispatch({
        type: GLOBAL_DRAG_END,
        start,
        finish,
        cardId,
    });
};

export const changeTitleAction = (title, tableId) => (dispatch) => {
    fetch(`${api}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
    dispatch({
        type: CHANGE_TITLE,
        title,
        tableId,
    });
};

export const createTableAction = (newTable) => (dispatch, getState) => {
    fetch(`${api}/tables`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            ...newTable,
        }),
    });
    fetch(`${api}/order`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ order: getState().orderState.concat(newTable.id) }),
    });
    dispatch({
        type: CREATE_TABLE,
        payload: {
            newTable,
        },
    });
};

export const tablesReducer = produce((draft = [], action) => {
    const {
        type,
        payload,
        newCard,
        tableId,
        newCardIds,
        start,
        finish,
        tables,
        card,
        title,
    } = action;

    switch (type) {
        case FETCH_TABLES:
            tables.forEach((item) => draft.push(item));
            break;

        case CREATE_CARD:
            draft.find((item) => item.id === newCard.tableId).cardIds.push(newCard.id);
            break;

        case REMOVE_CARD:
            draft.find((item) => item.id === card.tableId).cardIds = newCardIds;
            break;

        case LOCAL_DRAG_END:
            draft.find((item) => item.id === tableId).cardIds = newCardIds;
            break;

        case GLOBAL_DRAG_END:
            draft.find((item) => item.id === start.id).cardIds = start.cardIds;
            draft.find((item) => item.id === finish.id).cardIds = finish.cardIds;
            break;

        case CHANGE_TITLE:
            draft.find((item) => item.id === tableId).title = title;
            break;

        case CREATE_TABLE:
            draft.push(payload.newTable);
            break;

        default:
            return draft;
    }
});
