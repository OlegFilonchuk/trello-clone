import produce from 'immer';
import uuidv1 from 'uuid/v1';
// eslint-disable-next-line import/no-cycle
import { CREATE_CARD, REMOVE_CARD } from './cardsReducer';
import {
    updateOrder,
    createTable,
    getTables,
    updateCard,
    updateCardIds,
    updateTable,
    deleteTable,
} from '../../restApiController';

export const FETCH_TABLES = 'FETCH_TABLES';
export const LOCAL_DRAG_END = 'LOCAL_DRAG_END';
export const GLOBAL_DRAG_END = 'GLOBAL_DRAG_END';
export const CHANGE_TITLE = 'CHANGE_TITLE';
export const CREATE_TABLE = 'CREATE_TABLE';
export const REMOVE_TABLE = 'REMOVE_TABLE';

export const fetchTablesAction = () => async (dispatch) => {
    try {
        const { data } = await getTables();

        dispatch({
            type: FETCH_TABLES,
            payload: {
                tables: data,
            },
        });
    } catch (e) {
        // console.error(e);
    }
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

    try {
        await updateCardIds(tableId, newCardIds);
    } catch (e) {
        // if server error happened dispatch carIds of that table back
        dispatch({
            type: LOCAL_DRAG_END,
            payload: {
                tableId,
                newCardIds: oldCardIds,
            },
        });
    }
};

export const globalDragEndAction = (start, finish, cardId) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldStart = getState().tablesState.find((item) => item.id === start.id);
    const oldFinish = getState().tablesState.find((item) => item.id === finish.id);

    dispatch({
        type: GLOBAL_DRAG_END,
        payload: {
            start,
            finish,
            cardId,
        },
    });

    try {
        // if one of these functions fails we need to rollback
        await updateCardIds(start.id, start.cardIds);
        await updateCardIds(finish.id, finish.cardIds);
        await updateCard(cardId, 'tableId', finish.id);
    } catch (e) {
        dispatch({
            type: GLOBAL_DRAG_END,
            payload: {
                start: oldStart,
                finish: oldFinish,
                cardId,
            },
        });
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

    try {
        await updateTable(tableId, title);
    } catch (e) {
        // dispatching back in case of server error
        dispatch({
            type: CHANGE_TITLE,
            payload: {
                title: oldTitle,
                tableId,
            },
        });
    }
};

export const createTableAction = (newTable) => async (dispatch, getState) => {
    newTable.id = uuidv1();

    await createTable(newTable);

    const newOrder = getState().orderState.concat(newTable.id);

    await updateOrder(newOrder);

    dispatch({
        type: CREATE_TABLE,
        payload: {
            newTable,
        },
    });
};

export const removeTableAction = (tableId) => async (dispatch, getState) => {
    await deleteTable(tableId);

    const newOrder = getState().orderState.filter((item) => item !== tableId);

    await updateOrder(newOrder);

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
