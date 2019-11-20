import produce from 'immer'
import { CREATE_CARD } from './cardsReducer'

export const LOCAL_DRAG_END = 'LOCAL_DRAG_END'
export const GLOBAL_DRAG_END = 'GLOBAL_DRAG_END'

export const localDragEndAction = (tableId, newCardIds) => ({
    type: LOCAL_DRAG_END,
    tableId,
    newCardIds,
})

export const globalDragEndAction = (start, finish) => ({
    type: GLOBAL_DRAG_END,
    start,
    finish,
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

export const tablesReducer = produce((draft = initialState, action) => {
    const { type, newCard, tableId, newCardIds, start, finish } = action

    switch (type) {
        case CREATE_CARD:
            draft[newCard.tableId].cardIds.push(newCard.id)
            break

        case LOCAL_DRAG_END:
            draft[tableId].cardIds = newCardIds
            break

        case GLOBAL_DRAG_END:
            draft[start.id] = start
            draft[finish.id] = finish
            break

        default:
            return draft
    }
})
