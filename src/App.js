import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { Provider } from 'react-redux';
import Board from './components/Board';
import store from './redux/store';

const App = () => {
    return (
        <Provider store={store}>
            <div>
                <CssBaseline />
                <Board />
            </div>
        </Provider>
    );
};

export default App;
