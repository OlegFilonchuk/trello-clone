import { CREATE_CARD } from './cardsReducer'

export const DRAG_END = 'DRAG_END'

export const dragEndAction = (newState) => ({
    type: DRAG_END,
    newState,
})

const initialState = {
    table1: {
        id: 'table1',
        title: 'To do',
        cardIds: ['aaaaa', 'bbbbb', 'ccccc'],
    },
    table2: {
        id: 'table2',
        title: 'In progress',
        cardIds: ['ddddd'],
    },
    table3: {
        id: 'table3',
        title: 'Done',
        cardIds: [],
    },
}

export const tablesReducer = (state = initialState, action) => {
    const { type, newCard, newState } = action

    switch (type) {
        case CREATE_CARD:
            return {
                ...state,
                [newCard.tableId]: {
                    ...state[newCard.tableId],
                    cardIds: [...state[newCard.tableId].cardIds, newCard.id],
                },
            }
        case DRAG_END:
            return {
                ...state,
                ...newState,
            }
        default:
            return state
    }
}
