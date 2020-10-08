import { Web3Context } from 'contexts/Web3Context';
import Create from 'pages/create';
import Explore from 'pages/explore';
import FAQ from 'pages/faq';
import GrantDetails from 'pages/grant/details';
import Profile from 'pages/profile';
import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const Routes: React.FC = () => {
  const { account } = useContext(Web3Context);
  return (
    <Switch>
      <Route path="/explore" component={Explore} />
      {account && <Route path="/create" component={Create} />}
      {account && <Route path="/profile" component={Profile} />}
      <Route path="/faq" component={FAQ} />
      <Route path="/grant/:grantAddress" component={GrantDetails} />
      <Redirect to="/explore" />
    </Switch>
  );
};
