import Create from 'pages/create';
import Explore from 'pages/explore';
import FAQ from 'pages/faq';
import Grant from 'pages/grant/address';
import GrantStreams from 'pages/grant/streams';
import Profile from 'pages/profile/address';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const Routes: React.FC = () => (
  <Switch>
    <Route path="/explore" component={Explore} />
    <Route path="/create" component={Create} />
    <Route path="/profile/:userAddress" component={Profile} />
    <Route path="/faq" component={FAQ} />
    <Route path="/grant/:grantAddress/streams" component={GrantStreams} />
    <Route path="/grant/:grantAddress" component={Grant} />
    <Redirect to="/explore" />
  </Switch>
);
