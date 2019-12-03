import axios from 'axios';
import { SubmissionError } from 'redux-form';
import { ENDPOINTS } from './constants';

const { order, tables, cards, assigned } = ENDPOINTS;

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * gets tables order
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const getOrder = () => api.get(order);

/**
 * updates an order
 * @param {Array<string>} newOrder
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const updateOrder = (newOrder) => api.post(order, { order: newOrder });

/**
 * gets cards from server
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const getCards = () => api.get(cards);

/**
 * posts a card
 * @param {Object} newCard
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const postCard = (newCard) => api.post(cards, newCard);

/**
 * updates certain table's cardIds
 * @param {string} tableId
 * @param {Array<string>} cardIds
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const updateCardIds = (tableId, cardIds) => api.patch(`${tables}/${tableId}`, { cardIds });

/**
 * deletes a card
 * @param {string} cardId
 * @returns {Promise<AxiosResponse<Object>>}
 */
export const deleteCard = (cardId) => api.delete(`${cards}/${cardId}`);

/**
 * updates card's field
 * @param {string} cardId
 * @param {("text"|"desc"|"tableId"|"assigned"|"done")} field
 * @param {string} value
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateCard = (cardId, field, value) =>
    api.patch(`${cards}/${cardId}`, { [field]: value });

/**
 * gets tables
 * @returns {Promise<AxiosResponse<T>>}
 */
export const getTables = () => api.get(tables);

/**
 * updates table's title, mb later it would update other fields
 * @param {string} tableId
 * @param {string} title
 * @returns {Promise<AxiosResponse<T>>}
 */
export const updateTable = (tableId, title) => api.patch(`${tables}/${tableId}`, { title });

/**
 * creates a table
 * @param {Object} newTable
 * @returns {Promise<AxiosResponse<T>>}
 */
export const createTable = (newTable) => api.post(tables, newTable);

/**
 * removes table
 * @param {string} tableId
 * @returns {Promise<AxiosResponse<T>>}
 */
export const deleteTable = (tableId) => api.delete(`${tables}/${tableId}`);

export const getAssigned = () => api.get(assigned);

export const validateCardTitle = async (values) => {
    const { data } = await getCards();
    const titles = data.map((card) => card.text.toLowerCase());
    if (titles.includes(values.cardTitle.toLowerCase())) {
        throw new SubmissionError({
            cardTitle: 'A card with this title already exists!',
        });
    }
};

export const validateAssigned = async (values) => {
    if (values.assigned === '00') {
        throw new SubmissionError({
            assigned: 'Do not pick him!',
            _error: 'Wrong assigned!',
        });
    }
};
