import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './routes';

import './index.css';

injectTapEventPlugin();

ReactDOM.render(<Routes history={browserHistory} />, document.getElementById('root'));
