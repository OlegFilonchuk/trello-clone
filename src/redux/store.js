import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { cardsReducer } from './reducers/cardsReducer'
import { tablesReducer } from './reducers/tablesReducer'

const rootReducer = combineReducers({
    cardsState: cardsReducer,
    tablesState: tablesReducer,
})

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose

const enhancer = composeEnhancers(applyMiddleware())

const store = createStore(rootReducer, enhancer)

export default store
