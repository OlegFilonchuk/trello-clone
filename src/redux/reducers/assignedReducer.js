import produce from 'immer';
import { FETCH_ALL } from '../thunk';

export const FETCH_ASSIGNED = 'FETCH_ASSIGNED';

export const assignedReducer = produce((draft = [], action) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ASSIGNED:
        case FETCH_ALL:
            payload.assigned.forEach((item) => draft.push(item));
            break;

        default:
            return draft;
    }
});
