import { Web3Context } from 'contexts/Web3Context';
import Create from 'pages/create';
import Explore from 'pages/explore';
import FAQ from 'pages/faq';
import Grant from 'pages/grant/address';
import Profile from 'pages/profile/address';
import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const Routes: React.FC = () => {
  const { account } = useContext(Web3Context);
  return (
    <Switch>
      <Route path="/explore" component={Explore} />
      {account && <Route path="/create" component={Create} />}
      <Route path="/profile/:userAddress" component={Profile} />
      <Route path="/faq" component={FAQ} />
      <Route path="/grant/:grantAddress" component={Grant} />
      <Redirect to="/explore" />
    </Switch>
  );
};
