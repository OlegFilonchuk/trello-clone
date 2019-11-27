/**
 * selects all cards from state
 * @param state
 * @returns {(<Base extends Immutable<Params[0]>>(base: Base, ...rest: Tail<Parameters<Recipe>>) => Produced<Base, ReturnType<*>>) | []}
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
 * @param {string} tableId
 * @returns {*|NodePath|number|bigint|T|T}
 */
export const selectTableById = (state, tableId) => state.tables.find((item) => item.id === tableId);

/**
 * selects all tables from state
 * @param {Object} state
 * @returns {(<Base extends Immutable<Params[0]>>(base: Base, ...rest: Tail<Parameters<Recipe>>) => Produced<Base, ReturnType<*>>) | Array}
 */
export const selectAllTables = (state) => state.tables;

/**
 * selects an order of tables from state
 * @param {Object} state
 * @returns {Array<string>}
 */
export const selectOrder = (state) => state.order;
