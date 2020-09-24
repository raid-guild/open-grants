import Create from 'pages/create';
import Explore from 'pages/explore';
import FAQ from 'pages/faq';
import GrantDetails from 'pages/grant/details';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/explore" component={Explore} />
    <Route path="/create" component={Create} />
    <Route path="/faq" component={FAQ} />
    <Route path="/grant/:grantAddress" component={GrantDetails} />
    <Redirect to="/explore" />
  </Switch>
);
