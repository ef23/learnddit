import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './css/index.css';
import './css/pagination.css'
import './css/rc-select.css'
import Home from './components/Home';

// place a Header component on the line above Switch to get a universal header
const Root = () => (
  <BrowserRouter>
  	<Switch>
      <Route exact path='/' component={Home}/>
   	</Switch>
  </BrowserRouter>
)

ReactDOM.render(<Root />, document.getElementById('root'));
