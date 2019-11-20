import produce from 'immer'
import { CREATE_CARD } from './cardsReducer'

export const FETCH_TABLES = 'FETCH_TABLES'
export const LOCAL_DRAG_END = 'LOCAL_DRAG_END'
export const GLOBAL_DRAG_END = 'GLOBAL_DRAG_END'

export const fetchTablesAction = () => async (dispatch) => {
    const rawData = await fetch('http://localhost:3001/tables')
    const tables = await rawData.json()
    dispatch({
        type: FETCH_TABLES,
        tables,
    })
}

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

export const tablesReducer = (state = {}, action) =>
    produce(state, (draft) => {
        const { type, newCard, tableId, newCardIds, start, finish, tables } = action

        switch (type) {
            case FETCH_TABLES:
                return {
                    ...state,
                    ...tables,
                }

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
