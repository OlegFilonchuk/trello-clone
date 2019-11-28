import produce from 'immer';
import { getExecutors } from '../../restApiController';

export const FETCH_EXECUTORS = 'FETCH_EXECUTORS';

export const fetchExecutorsAction = () => async (dispatch) => {
    try {
        const { data } = await getExecutors();

        dispatch({
            type: FETCH_EXECUTORS,
            payload: {
                executors: data,
            },
        });
    } catch (e) {
        // console.log(e)
    }
};

export const executorsReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_EXECUTORS:
            payload.executors.forEach((item) => draft.push(item));
            break;

        default:
            return draft;
    }
});
