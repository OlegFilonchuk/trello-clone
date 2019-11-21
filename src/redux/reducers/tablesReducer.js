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

export const localDragEndAction = (tableId, newCardIds) => (dispatch) => {
    fetch(`http://localhost:3001/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    })
    dispatch({
        type: LOCAL_DRAG_END,
        tableId,
        newCardIds,
    })
}

export const globalDragEndAction = (start, finish) => (dispatch) => {
    fetch(`http://localhost:3001/tables/${start.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: start.cardIds }),
    })
    fetch(`http://localhost:3001/tables/${finish.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: finish.cardIds }),
    })
    dispatch({
        type: GLOBAL_DRAG_END,
        start,
        finish,
    })
}

export const tablesReducer = (state = [], action) =>
    produce(state, (draft) => {
        const { type, newCard, tableId, newCardIds, start, finish, tables } = action

        switch (type) {
            case FETCH_TABLES:
                for (const table of tables) {
                    draft.push(table)
                }
                break

            case CREATE_CARD:
                draft.find((item) => item.id === newCard.tableId).cardIds.push(newCard.id)
                break

            case LOCAL_DRAG_END:
                draft.find((item) => item.id === tableId).cardIds = [...newCardIds]
                break

            case GLOBAL_DRAG_END:
                draft.find((item) => item.id === start.id).cardIds = start.cardIds
                draft.find((item) => item.id === finish.id).cardIds = finish.cardIds
                break
        }
    })
