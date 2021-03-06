import produce from 'immer';
import uuidv1 from 'uuid/v1';
import { postCard, updateCardIds, deleteCard, updateCard } from '../../restApiController';
import { GLOBAL_DRAG_END, REMOVE_CARD, CREATE_CARD } from '../../constants';
import { FETCH_ALL } from '../thunk';

export const FETCH_CARDS = '[cards]FETCH_CARDS';
export const CHANGE_DESC = '[cards]CHANGE_DESC';
export const CHANGE_TEXT = '[cards]CHANGE_TEXT';
export const CHANGE_ASSIGNED = '[cards]CHANGE_ASSIGNED';
export const CHANGE_DONE = '[cards]CHANGE_DONE';

/**
 * adds a new card to server and client
 * @param {Object} newCard
 * @returns {Promise<Object>}
 */
export const createCardAction = (newCard) => async (dispatch, getState) => {
    newCard.id = uuidv1();

    try {
        await postCard(newCard);

        const newCardIds = getState()
            .tables.find((item) => item.id === newCard.tableId)
            .cardIds.concat(newCard.id);

        await updateCardIds(newCard.tableId, newCardIds);

        dispatch({
            type: CREATE_CARD,
            payload: {
                newCard,
            },
        });
    } catch (e) {
        // console.error(e)
    }
};

/**
 * removes a card from server and client
 * @param {Object} card
 * @returns {Function}
 */
export const removeCardAction = (card) => async (dispatch, getState) => {
    try {
        await deleteCard(card.id);

        const table = getState().tables.find((item) => item.id === card.tableId);
        const newCardIds = table.cardIds.filter((item) => item !== card.id);

        await updateCardIds(card.tableId, newCardIds);

        dispatch({
            type: REMOVE_CARD,
            payload: {
                card,
                newCardIds,
            },
        });
    } catch (e) {
        // console.error(e)
    }
};

/**
 * changes card's description on server and client
 * @param {string} desc
 * @param {string} cardId
 * @returns {Function}
 */
export const changeDescAction = (desc, cardId) => async (dispatch) => {
    try {
        await updateCard(cardId, 'desc', desc);

        dispatch({
            type: CHANGE_DESC,
            payload: {
                desc,
                cardId,
            },
        });
    } catch (e) {
        // console.error(e)
    }
};

export const changeAssignedAction = (assignedId, cardId) => async (dispatch) => {
    try {
        await updateCard(cardId, 'assigned', assignedId);

        dispatch({
            type: CHANGE_ASSIGNED,
            payload: {
                assignedId,
                cardId,
            },
        });
    } catch (e) {
        // console.log(e);
    }
};

export const changeDoneAction = (done, cardId) => async (dispatch) => {
    try {
        await updateCard(cardId, 'done', done);
        dispatch({
            type: CHANGE_DONE,
            payload: {
                done,
                cardId,
            },
        });
    } catch (e) {
        // console.log(e);
    }
};

/**
 * changes card's text on server and client
 * @param {string} text
 * @param {string} cardId
 * @returns {Function}
 */
export const changeTextAction = (text, cardId) => async (dispatch, getState) => {
    // visual bug happens while fetching
    const oldText = getState().cards.find((item) => item.id === cardId).text;

    dispatch({
        type: CHANGE_TEXT,
        payload: {
            text,
            cardId,
        },
    });

    try {
        await updateCard(cardId, 'text', text);
    } catch (e) {
        // dispatching back in case of error
        dispatch({
            type: CHANGE_TEXT,
            payload: {
                text: oldText,
                cardId,
            },
        });
    }
};

export const cardsReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CARDS:
        case FETCH_ALL:
            payload.cards.forEach((item) => draft.push(item));
            break;

        case CREATE_CARD:
            draft.push(payload.newCard);
            break;

        case REMOVE_CARD:
            return draft.filter((item) => item.id !== payload.card.id);

        case GLOBAL_DRAG_END:
            draft.find((item) => item.id === payload.cardId).tableId = payload.finish.id;
            break;

        case CHANGE_DESC:
            draft.find((item) => item.id === payload.cardId).desc = payload.desc;
            break;

        case CHANGE_TEXT:
            draft.find((item) => item.id === payload.cardId).text = payload.text;
            break;

        case CHANGE_ASSIGNED:
            draft.find((item) => item.id === payload.cardId).assigned = payload.assignedId;
            break;

        case CHANGE_DONE:
            draft.find((item) => item.id === payload.cardId).done = payload.done;
            break;

        default:
            return draft;
    }
});
