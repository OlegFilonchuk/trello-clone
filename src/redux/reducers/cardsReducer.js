import produce from 'immer'

export const CREATE_CARD = 'CREATE_CARD'

export const createCardAction = (newCard) => ({
    type: CREATE_CARD,
    newCard,
})

const initialState = {
    aaaaa: {
        id: 'aaaaa',
        text: 'aaaaa',
        tableId: 'table1',
    },
    bbbbb: {
        id: 'bbbbb',
        text: 'bbbbb',
        tableId: 'table1',
    },
    ccccc: {
        id: 'ccccc',
        text: 'ccccc',
        tableId: 'table1',
    },
    ddddd: {
        id: 'ddddd',
        text: 'ddddd',
        tableId: 'table1',
    },
}

export const cardsReducer = produce((draft = initialState, action) => {
    const { type, newCard } = action

    switch (type) {
        case CREATE_CARD:
            draft[newCard.id] = newCard
            break
        default:
            return draft
    }
})
