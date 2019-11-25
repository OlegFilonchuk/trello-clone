import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { cardsReducer } from './reducers/cardsReducer';
import { tablesReducer } from './reducers/tablesReducer';
import { orderReducer } from './reducers/orderReducer';

const rootReducer = combineReducers({
    cardsState: cardsReducer,
    tablesState: tablesReducer,
    orderState: orderReducer,
});

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(rootReducer, enhancer);

export default store;
