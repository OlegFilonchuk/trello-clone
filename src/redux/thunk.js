import { getAssigned, getCards, getOrder, getTables } from '../restApiController';

export const FETCH_ALL = 'FETCH_ALL';

export const fetchAllAction = () => async (dispatch) => {
    try {
        const { data: assigned } = await getAssigned();
        const {
            data: { order },
        } = await getOrder();
        const { data: cards } = await getCards();
        const { data: tables } = await getTables();

        dispatch({
            type: FETCH_ALL,
            payload: {
                assigned,
                order,
                cards,
                tables,
            },
        });
    } catch (e) {
        // console.error(e);
    }
};
