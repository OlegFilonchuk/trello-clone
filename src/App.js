import React from 'react';
import { CssBaseline } from '@material-ui/core';
import Board from './components/Board';

const App = () => {
    return (
        <div className="app">
            <CssBaseline />
            <Board />
        </div>
    );
};

export default App;
