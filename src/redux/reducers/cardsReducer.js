import produce from 'immer';
import uuidv1 from 'uuid/v1';
import { getCards, postCard, updateCardIds, deleteCard, updateCard } from '../../restApiController';
// eslint-disable-next-line import/no-cycle
import { GLOBAL_DRAG_END } from './tablesReducer';

export const FETCH_CARDS = 'FETCH_CARDS';
export const CREATE_CARD = 'CREATE_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
export const CHANGE_DESC = 'CHANGE_DESC';
export const CHANGE_TEXT = 'CHANGE_TEXT';
export const CHANGE_EXECUTOR = 'CHANGE_EXECUTOR';
export const CHANGE_DONE = 'CHANGE_DONE';

/**
 * fetches cards from server
 * @returns {Function}
 */
export const fetchCardsAction = () => async (dispatch) => {
    // const rawRes = await fetch(`${api}/cards`);
    try {
        const { data } = await getCards();

        dispatch({
            type: FETCH_CARDS,
            payload: {
                cards: data,
            },
        });
    } catch (e) {
        // console.error(e);
    }
};

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

export const changeExecutorAction = (executorId, cardId) => async (dispatch) => {
    try {
        await updateCard(cardId, 'executor', executorId);

        dispatch({
            type: CHANGE_EXECUTOR,
            payload: {
                executorId,
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

        case CHANGE_EXECUTOR:
            draft.find((item) => item.id === payload.cardId).executor = payload.executorId;
            break;

        case CHANGE_DONE:
            draft.find((item) => item.id === payload.cardId).done = payload.done;
            break;

        default:
            return draft;
    }
});
