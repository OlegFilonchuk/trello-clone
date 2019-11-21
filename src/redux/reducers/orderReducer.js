import produce from 'immer'

const FETCH_ORDER = 'FETCH_ORDER'
const CHANGE_ORDER = 'CHANGE_ORDER'

export const fetchOrderAction = () => async (dispatch) => {
    const rawData = await fetch('http://localhost:3001/order')
    const order = await rawData.json()
    dispatch({
        type: FETCH_ORDER,
        order: order.order,
    })
}

export const changeOrderAction = (newOrder) => (dispatch) => {
    fetch('http://localhost:3001/order', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            order: newOrder,
        }),
    })
    dispatch({
        type: CHANGE_ORDER,
        newOrder,
    })
}

export const orderReducer = produce((draft = [], action) => {
    const { type, order, newOrder } = action

    switch (type) {
        case FETCH_ORDER:
            order.forEach((item) => draft.push(item))
            break

        case CHANGE_ORDER:
            return [...newOrder]

        default:
            return draft
    }
})
