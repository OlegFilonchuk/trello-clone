import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import { cardsReducer } from './reducers/cardsReducer';
import { tablesReducer } from './reducers/tablesReducer';
import { orderReducer } from './reducers/orderReducer';
import { assignedReducer } from './reducers/assignedReducer';

const rootReducer = combineReducers({
    cards: cardsReducer,
    tables: tablesReducer,
    order: orderReducer,
    assigned: assignedReducer,
    form: formReducer,
});

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(rootReducer, enhancer);

export default store;
