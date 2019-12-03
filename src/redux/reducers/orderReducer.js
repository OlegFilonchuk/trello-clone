import produce from 'immer';
import { CREATE_TABLE, REMOVE_TABLE } from './tablesReducer';
import { getOrder, updateOrder } from '../../restApiController';

const FETCH_ORDER = '[order]FETCH_ORDER';
const CHANGE_ORDER = '[order]CHANGE_ORDER';

/**
 * fetches order from server
 * @returns {Function}
 */
export const fetchOrderAction = () => async (dispatch) => {
    try {
        const { data } = await getOrder();

        dispatch({
            type: FETCH_ORDER,
            payload: {
                order: data.order,
            },
        });
    } catch (e) {
        // console.error(e);
    }
};

/**
 * updates order on server and client
 * @param {Array<string>} newOrder
 * @returns {Function}
 */
export const changeOrderAction = (newOrder) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldOrder = getState().order;

    dispatch({
        type: CHANGE_ORDER,
        payload: {
            newOrder,
        },
    });

    try {
        await updateOrder(newOrder);
    } catch (e) {
        dispatch({
            type: CHANGE_ORDER,
            payload: {
                newOrder: oldOrder,
            },
        });
    }
};

export const orderReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ORDER:
            payload.order.forEach((item) => draft.push(item));
            break;

        case CHANGE_ORDER:
            return [...payload.newOrder];

        case CREATE_TABLE:
            draft.push(payload.newTable.id);
            break;

        case REMOVE_TABLE:
            return draft.filter((item) => item !== payload.tableId);

        default:
            return draft;
    }
});
