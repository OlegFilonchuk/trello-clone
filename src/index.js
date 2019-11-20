/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, ReactReduxContext } from 'react-redux'
import store from './redux/store'
import App from './App'
import './index.css'

ReactDOM.render(
    <Provider store={store} context={ReactReduxContext}>
        <App />
    </Provider>,
    document.getElementById('root')
)
