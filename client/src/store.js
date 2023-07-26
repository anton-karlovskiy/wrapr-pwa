
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const inititalState = {};

const bindMiddleware = (middleware) => {
    // TODO: dotenv setting needed
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        const { createLogger } = require('redux-logger');
        return composeWithDevTools(
                compose(
                    applyMiddleware(...middleware, createLogger({ collapsed: true }))
                )
            );
    }
    return applyMiddleware(...middleware);
};

const store = createStore(
    rootReducer,
    inititalState,
    compose(bindMiddleware([thunk]))        
);

export default store;
