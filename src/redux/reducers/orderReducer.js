import produce from 'immer';
import { CREATE_TABLE } from './tablesReducer';

const FETCH_ORDER = 'FETCH_ORDER';
const CHANGE_ORDER = 'CHANGE_ORDER';
const api = process.env.REACT_APP_API_URI;

export const fetchOrderAction = () => async (dispatch) => {
    const rawData = await fetch(`${api}/order`);
    const order = await rawData.json();
    dispatch({
        type: FETCH_ORDER,
        order: order.order,
    });
};

export const changeOrderAction = (newOrder) => (dispatch) => {
    fetch(`${api}/order`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            order: newOrder,
        }),
    });
    dispatch({
        type: CHANGE_ORDER,
        newOrder,
    });
};

export const orderReducer = produce((draft = [], action) => {
    const { type, payload, order, newOrder } = action;

    switch (type) {
        case FETCH_ORDER:
            order.forEach((item) => draft.push(item));
            break;

        case CHANGE_ORDER:
            return [...newOrder];

        case CREATE_TABLE:
            draft.push(payload.newTable.id);
            break;
        default:
            return draft;
    }
});
