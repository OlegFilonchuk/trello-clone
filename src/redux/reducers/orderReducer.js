import produce from 'immer';
import { CREATE_TABLE, REMOVE_TABLE } from './tablesReducer';

const FETCH_ORDER = 'FETCH_ORDER';
const CHANGE_ORDER = 'CHANGE_ORDER';
const api = process.env.REACT_APP_API_URI;

export const fetchOrderAction = () => async (dispatch) => {
    const rawRes = await fetch(`${api}/order`);

    if (!rawRes.ok) return;

    const order = await rawRes.json();
    dispatch({
        type: FETCH_ORDER,
        payload: {
            order: order.order,
        },
    });
};

export const changeOrderAction = (newOrder) => async (dispatch, getState) => {
    // dispatch comes first because of visual bug happening while fetch is awaiting
    const oldOrder = getState().orderState;

    dispatch({
        type: CHANGE_ORDER,
        payload: {
            newOrder,
        },
    });

    const rawRes = await fetch(`${api}/order`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            order: newOrder,
        }),
    });

    // if server error happened dispatch client tables order back
    !rawRes.ok &&
        dispatch({
            type: CHANGE_ORDER,
            payload: {
                newOrder: oldOrder,
            },
        });
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
