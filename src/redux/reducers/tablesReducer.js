import produce from 'immer';
// eslint-disable-next-line import/no-cycle
import { CREATE_CARD, REMOVE_CARD } from './cardsReducer';

export const FETCH_TABLES = 'FETCH_TABLES';
export const LOCAL_DRAG_END = 'LOCAL_DRAG_END';
export const GLOBAL_DRAG_END = 'GLOBAL_DRAG_END';
export const CHANGE_TITLE = 'CHANGE_TITLE';
export const CREATE_TABLE = 'CREATE_TABLE';
export const REMOVE_TABLE = 'REMOVE_TABLE';

const api = process.env.REACT_APP_API_URI;

export const fetchTablesAction = () => async (dispatch) => {
    const rawData = await fetch(`${api}/tables`);
    const tables = await rawData.json();
    dispatch({
        type: FETCH_TABLES,
        payload: {
            tables,
        },
    });
};

export const localDragEndAction = (tableId, newCardIds) => (dispatch) => {
    fetch(`${api}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });

    dispatch({
        type: LOCAL_DRAG_END,
        payload: {
            tableId,
            newCardIds,
        },
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
        payload: {
            start,
            finish,
            cardId,
        },
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
        payload: {
            title,
            tableId,
        },
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

    const newOrder = getState().orderState.concat(newTable.id);

    fetch(`${api}/order`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
    });

    dispatch({
        type: CREATE_TABLE,
        payload: {
            newTable,
        },
    });
};

export const removeTableAction = (tableId) => (dispatch, getState) => {
    fetch(`${api}/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    });

    const newOrder = getState().orderState.filter((item) => item !== tableId);

    fetch(`${api}/order`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
    });

    dispatch({
        type: REMOVE_TABLE,
        payload: {
            tableId,
        },
    });
};

export const tablesReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_TABLES:
            payload.tables.forEach((item) => draft.push(item));
            break;

        case CREATE_CARD:
            draft
                .find((item) => item.id === payload.newCard.tableId)
                .cardIds.push(payload.newCard.id);
            break;

        case REMOVE_CARD:
            draft.find((item) => item.id === payload.card.tableId).cardIds = payload.newCardIds;
            break;

        case LOCAL_DRAG_END:
            draft.find((item) => item.id === payload.tableId).cardIds = payload.newCardIds;
            break;

        case GLOBAL_DRAG_END:
            draft.find((item) => item.id === payload.start.id).cardIds = payload.start.cardIds;
            draft.find((item) => item.id === payload.finish.id).cardIds = payload.finish.cardIds;
            break;

        case CHANGE_TITLE:
            draft.find((item) => item.id === payload.tableId).title = payload.title;
            break;

        case CREATE_TABLE:
            draft.push(payload.newTable);
            break;

        case REMOVE_TABLE:
            return draft.filter((item) => item.id !== payload.tableId);

        default:
            return draft;
    }
});
