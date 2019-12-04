import { createSelector } from 'reselect';

/**
 * selects all cards from state
 * @param {Object} state
 * @returns {Array<Object>}
 */
export const selectAllCards = (state) => state.cards;

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

/**
 * selects cards from state for certain table
 * @param {Object} state
 * @param {Array} state.cards
 * @param {String} tableId
 * @returns {Array<Object>}
 */
export const getCardsForTable = ({ cards }, tableId) =>
    cards.length ? cards.filter((item) => item.tableId === tableId) : [];

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

export const selectTablesInOrder = createSelector(selectAllTables, selectOrder, (tables, order) =>
    tables.length ? order.map((tableId) => tables.find((item) => item.id === tableId)) : []
);
