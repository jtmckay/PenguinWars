import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import LayoutPage from './components/LayoutPage';
import HomePage from './components/home/HomePage';

//* handles unkowns and the given level

export default (
  <Route path="/" component={LayoutPage}>
    <IndexRoute component={HomePage} />
    <Route path="*" component={HomePage} />
  </Route>
);
