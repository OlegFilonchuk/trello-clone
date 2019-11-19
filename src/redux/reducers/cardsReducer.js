export const CREATE_CARD = "CREATE_CARD"

export const createCardAction = (newCard) => ({
    type: CREATE_CARD,
    newCard,
})

const initialState = {
    cards: [
        {
            id: 0,
            text: "some text",
            tableId: 0,
        },
        {
            id: 1,
            text: "lorem ipsum",
            tableId: 0,
        },
    ],
}

export const cardsReducer = (state = initialState, action) => {
    const { type, newCard } = action

    switch (type) {
        case CREATE_CARD:
            return {
                ...state,
                cards: [...state.cards, newCard],
            }
        default:
            return state
    }
}
