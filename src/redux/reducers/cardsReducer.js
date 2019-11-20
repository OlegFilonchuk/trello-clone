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

export const createCardAction = (newCard) => async (dispatch) => {
    fetch('http://localhost:3001/cards', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(newCard),
    })
    // fetch(`http://localhost:3001/tables/${newCard.tableId}`, )
    dispatch({
        type: CREATE_CARD,
        newCard,
    })
}

export const cardsReducer = (state = {}, action) =>
    produce(state, (draft) => {
        const { type, newCard, cards } = action

        switch (type) {
            case FETCH_CARDS:
                draft = {
                    ...draft,
                    ...cards,
                }
                break

            case CREATE_CARD:
                draft[newCard.id] = newCard
                break

            default:
                return draft
        }
    })
