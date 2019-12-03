import produce from 'immer';
import { getAssigned } from '../../restApiController';

export const FETCH_ASSIGNED = 'FETCH_ASSIGNED';

export const fetchAssignedAction = () => async (dispatch) => {
    try {
        const { data } = await getAssigned();

        dispatch({
            type: FETCH_ASSIGNED,
            payload: {
                assigned: data,
            },
        });
    } catch (e) {
        // console.log(e)
    }
};

export const assignedReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ASSIGNED:
            payload.assigned.forEach((item) => draft.push(item));
            break;

        default:
            return draft;
    }
});
