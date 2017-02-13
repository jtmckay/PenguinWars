import * as React  from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

document.addEventListener('contextmenu', event => event.preventDefault());
//document.body.addEventListener('touchmove', event => event.preventDefault());

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
);
