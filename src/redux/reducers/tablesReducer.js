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
    const rawRes = await fetch(`${api}/tables`);
    if (!rawRes.ok) return;
    const tables = await rawRes.json();
    dispatch({
        type: FETCH_TABLES,
        payload: {
            tables,
        },
    });
};

export const localDragEndAction = (tableId, newCardIds) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldCardIds = getState().tablesState.find((item) => item.id === tableId);

    dispatch({
        type: LOCAL_DRAG_END,
        payload: {
            tableId,
            newCardIds,
        },
    });

    const rawRes = await fetch(`${api}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    });

    // if server error happened dispatch carIds of that table back
    !rawRes.ok &&
        dispatch({
            type: LOCAL_DRAG_END,
            payload: {
                tableId,
                newCardIds: oldCardIds,
            },
        });
};

export const globalDragEndAction = (start, finish, cardId) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldStart = getState().tablesState.find((item) => item.id === start.id);
    const oldFinish = getState().tablesState.find((item) => item.id === finish.id);
    const oldCard = getState().cardsState.find((item) => item.id === cardId);
    const dispatchBack = () =>
        dispatch({
            type: GLOBAL_DRAG_END,
            payload: {
                start: oldStart,
                finish: oldFinish,
                cardId: oldCard.id,
            },
        });

    dispatch({
        type: GLOBAL_DRAG_END,
        payload: {
            start,
            finish,
            cardId,
        },
    });

    const raw1 = await fetch(`${api}/tables/${start.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: start.cardIds }),
    });

    if (!raw1.ok) {
        dispatchBack();
        return;
    }

    const raw2 = await fetch(`${api}/tables/${finish.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: finish.cardIds }),
    });

    if (!raw2.ok) {
        dispatchBack();
        return;
    }

    const raw3 = await fetch(`${api}/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ tableId: finish.id }),
    });

    if (!raw3.ok) {
        dispatchBack();
    }
};

export const changeTitleAction = (title, tableId) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldTitle = getState().tablesState.find((item) => item.id === tableId).title;

    dispatch({
        type: CHANGE_TITLE,
        payload: {
            title,
            tableId,
        },
    });

    const rawRes = await fetch(`${api}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });

    // dispatching back in case of server error
    !rawRes.ok &&
        dispatch({
            type: CHANGE_TITLE,
            payload: {
                title: oldTitle,
                tableId,
            },
        });
};

export const createTableAction = (newTable) => async (dispatch, getState) => {
    const raw1 = await fetch(`${api}/tables`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            ...newTable,
        }),
    });

    if (!raw1.ok) return;

    const newOrder = getState().orderState.concat(newTable.id);

    const raw2 = await fetch(`${api}/order`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
    });

    if (!raw2.ok) return;

    dispatch({
        type: CREATE_TABLE,
        payload: {
            newTable,
        },
    });
};

export const removeTableAction = (tableId) => async (dispatch, getState) => {
    const raw1 = await fetch(`${api}/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    });

    if (!raw1.ok) return;

    const newOrder = getState().orderState.filter((item) => item !== tableId);

    const raw2 = await fetch(`${api}/order`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
    });

    if (!raw2.ok) return;

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
