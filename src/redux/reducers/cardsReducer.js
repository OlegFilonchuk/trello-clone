import produce from 'immer'

export const FETCH_CARDS = 'FETCH_CARDS'
export const CREATE_CARD = 'CREATE_CARD'

export const fetchCardsAction = () => async (dispatch) => {
    const rawData = await fetch('http://localhost:3001/cards')
    const cards = await rawData.json()
    dispatch({
        type: FETCH_CARDS,
        cards,
    })
}

export const createCardAction = (newCard, cardIds) => async (dispatch) => {
    fetch('http://localhost:3001/cards', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(newCard),
    })
    fetch(`http://localhost:3001/tables/${newCard.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: cardIds.concat(newCard.id) }),
    })
    dispatch({
        type: CREATE_CARD,
        newCard,
    })
}

export const cardsReducer = produce((draft = [], action) => {
    const { type, newCard, cards } = action

    switch (type) {
        case FETCH_CARDS:
            for (const card of cards) {
                draft.push(card)
            }
            break

        case CREATE_CARD:
            draft.push(newCard)
            break

        default:
            return draft
    }
})
