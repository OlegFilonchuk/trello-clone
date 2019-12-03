import produce from 'immer';
import uuidv1 from 'uuid/v1';
import {
    updateOrder,
    createTable,
    getTables,
    updateCard,
    updateCardIds,
    updateTable,
    deleteTable,
} from '../../restApiController';
import { CREATE_CARD, REMOVE_CARD, GLOBAL_DRAG_END } from '../../constants';

export const FETCH_TABLES = '[tables]FETCH_TABLES';
export const LOCAL_DRAG_END = '[tables]LOCAL_DRAG_END';
export const CHANGE_TITLE = '[tables]CHANGE_TITLE';
export const CREATE_TABLE = '[tables]CREATE_TABLE';
export const REMOVE_TABLE = '[tables]REMOVE_TABLE';

/**
 * fetches tables from server
 * @returns {Function}
 */
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

/**
 * handles a drag inside one table
 * @param {string} tableId
 * @param {Array<string>} newCardIds
 * @returns {Function}
 */
export const localDragEndAction = (tableId, newCardIds) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldCardIds = getState().tables.find((item) => item.id === tableId);

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

/**
 * handles drag between different tables
 * @param {Object} start
 * @param {Object} finish
 * @param {string} cardId
 * @returns {Function}
 */
export const globalDragEndAction = (start, finish, cardId) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldStart = getState().tables.find((item) => item.id === start.id);
    const oldFinish = getState().tables.find((item) => item.id === finish.id);

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

/**
 * changes table's title
 * @param {string} title
 * @param {string} tableId
 * @returns {Function}
 */
export const changeTitleAction = (title, tableId) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldTitle = getState().tables.find((item) => item.id === tableId).title;

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

/**
 * creates a new table on server and client
 * @param {Object} newTable
 * @returns {Function}
 */
export const createTableAction = (newTable) => async (dispatch, getState) => {
    const table = { ...newTable };

    table.id = uuidv1();

    await createTable(table);

    const newOrder = getState().order.concat(table.id);

    await updateOrder(newOrder);

    dispatch({
        type: CREATE_TABLE,
        payload: {
            newTable: table,
        },
    });
};

/**
 * removes table from server and client
 * @param {string} tableId
 * @returns {Function}
 */
export const removeTableAction = (tableId) => async (dispatch, getState) => {
    await deleteTable(tableId);

    const newOrder = getState().order.filter((item) => item !== tableId);

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
