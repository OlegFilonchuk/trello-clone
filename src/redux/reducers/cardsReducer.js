import produce from 'immer'

export const FETCH_CARDS = 'FETCH_CARDS'
export const CREATE_CARD = 'CREATE_CARD'
export const REMOVE_CARD = 'REMOVE_CARD'

export const fetchCardsAction = () => async (dispatch) => {
    const rawData = await fetch('http://localhost:3001/cards')
    const cards = await rawData.json()
    dispatch({
        type: FETCH_CARDS,
        cards,
    })
}

export const createCardAction = (newCard, cardIds) => (dispatch) => {
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

export const removeCardAction = (card, newCardIds) => (dispatch) => {
    fetch(`http://localhost:3001/cards/${card.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
    })
    fetch(`http://localhost:3001/tables/${card.tableId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ cardIds: newCardIds }),
    })
    dispatch({
        type: REMOVE_CARD,
        card,
        newCardIds,
    })
}

export const cardsReducer = produce((draft = [], action) => {
    const { type, newCard, cards, card } = action

    switch (type) {
        case FETCH_CARDS:
            cards.forEach((item) => draft.push(item))
            break

        case CREATE_CARD:
            draft.push(newCard)
            break

        case REMOVE_CARD:
            return draft.filter((item) => item.id !== card.id)

        default:
            return draft
    }
})
