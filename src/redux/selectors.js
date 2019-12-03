/**
 * selects all cards from state
 * @param {Object} state
 * @returns {Array<Object>}
 */
export const selectAllCards = (state) => state.cards;

/**
 * selects cards from state for certain table
 * @param {Object} state
 * @param {Array} state.cards
 * @param {Array<string>} tableCardIds
 * @returns {Array<Object>}
 */
export const selectCardsForTable = (state, tableCardIds) => {
    const { cards } = state;
    return cards.length
        ? tableCardIds.map((cardId) => cards.find((item) => item.id === cardId))
        : [];
};

/**
 * selects a table from state by id
 * @param {Object} state
 * @param {Array} state.tables
 * @param {Object} ownProps
 * @param {string} ownProps.tableId
 * @returns {Object}
 */
export const selectTableById = (state, ownProps) =>
    state.tables.find((item) => item.id === ownProps.tableId);

/**
 * selects all tables from state
 * @param {Object} state
 * @returns {Array<Object>}
 */
export const selectAllTables = (state) => state.tables;

/**
 * selects an order of tables from state
 * @param {Object} state
 * @returns {Array<string>}
 */
export const selectOrder = (state) => state.order;

export const selectAllAssigned = (state) => state.assigned;

export const getTablesInOrder = ({ tables, order }) => {
    if (tables.length) {
        return order.map((tableId) => tables.find((item) => item.id === tableId));
    }
    return [];
};
