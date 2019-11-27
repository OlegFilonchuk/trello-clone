import axios from 'axios';
import { order, tables, cards } from './constants';

const myAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * gets tables order
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getOrder = () => myAxios.get(order);

/**
 * updates an order
 * @param {Array<string>} newOrder
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateOrder = (newOrder) => myAxios.post(order, { order: newOrder });

/**
 * gets cards from server
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getCards = () => myAxios.get(cards);

/**
 * posts a card
 * @param {Object} newCard
 * @returns {Promise<AxiosResponse<T>>}
 */
export const postCard = (newCard) => myAxios.post(cards, newCard);

/**
 * updates certain table's cardIds
 * @param {string} tableId
 * @param {Array<string>} cardIds
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateCardIds = (tableId, cardIds) =>
    myAxios.patch(`${tables}/${tableId}`, { cardIds });

/**
 * deletes a card
 * @param {string} cardId
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteCard = (cardId) => myAxios.delete(`${cards}/${cardId}`);

/**
 * updates card's field
 * @param {string} cardId
 * @param {("text"|"desc"|"tableId")} field
 * @param {string} value
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateCard = (cardId, field, value) =>
    myAxios.patch(`${cards}/${cardId}`, { [field]: value });

/**
 * gets tables
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getTables = () => myAxios.get(tables);

/**
 * updates table's title, mb later it would update other fields
 * @param {string} tableId
 * @param {string} title
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateTable = (tableId, title) => myAxios.patch(`${tables}/${tableId}`, { title });

/**
 * creates a table
 * @param {Object} newTable
 * @returns {Promise<AxiosResponse<T>>}
 */
export const createTable = (newTable) => myAxios.post(tables, newTable);

/**
 * removes table
 * @param {string} tableId
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteTable = (tableId) => myAxios.delete(`${tables}/${tableId}`);
