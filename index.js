import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Home from './pages/Home';
import Game from './pages/Game';
import { BrowserRouter, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
        <BrowserRouter>
            <App>
                <Route path="/" exact component={Home}/>
                <Route path="/game" component={Game}/ >
            </App>
        </BrowserRouter>,
    document.querySelector('#root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
