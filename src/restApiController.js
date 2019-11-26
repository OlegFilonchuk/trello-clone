import axios from 'axios';
import { order, tables, cards } from './constants';

const myAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axios.defaults.baseURL = process.env.REACT_APP_API_URI;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.patch['Content-Type'] = 'application/json';

export const getOrder = () => myAxios.get(order);
export const updateOrder = (newOrder) => myAxios.post(order, { order: newOrder });
export const getCards = () => myAxios.get(cards);
export const postCard = (newCard) => myAxios.post(cards, newCard);
export const updateCardIds = (tableId, cardIds) =>
    myAxios.patch(`${tables}/${tableId}`, { cardIds });
export const deleteCard = (cardId) => myAxios.delete(`${cards}/${cardId}`);
export const updateCard = (cardId, field, value) =>
    myAxios.patch(`${cards}/${cardId}`, { [field]: value });
export const getTables = () => myAxios.get(tables);
export const updateTable = (tableId, title) => myAxios.patch(`${tables}/${tableId}`, { title });
export const createTable = (newTable) => myAxios.post(tables, newTable);
export const deleteTable = (tableId) => myAxios.delete(`${tables}/${tableId}`);
