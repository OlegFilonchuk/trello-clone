import { CREATE_CARD } from './cardsReducer'

export const DRAG_END = 'DRAG_END'

export const dragEndAction = (table) => ({
    type: DRAG_END,
    table,
})

const initialState = {
    table1: {
        id: 'table1',
        title: 'To do',
        cardIds: ['bbbbb', 'aaaaa', 'ccccc'],
    },
    table2: {
        id: 'table2',
        title: 'Doing',
        cardIds: [],
    },
    table3: {
        id: 'table3',
        title: 'Done',
        cardIds: [],
    },
}

export const tablesReducer = (state = initialState, action) => {
    const { type, newCard, table } = action

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
                [table.id]: table,
            }
        default:
            return state
    }
}
