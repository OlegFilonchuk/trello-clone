export const selectAllCards = (state) => state.cards;

export const selectCardsForTable = (state, tableCardIds) => {
    const { cards } = state;
    return cards.length
        ? tableCardIds.map((cardId) => cards.find((item) => item.id === cardId))
        : [];
};

export const selectTableById = (state, tableId) => state.tables.find((item) => item.id === tableId);

export const selectAllTables = (state) => state.tables;

export const selectOrder = (state) => state.order;
