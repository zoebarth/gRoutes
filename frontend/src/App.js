import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import SearchView from './SearchView.js';
import ExploreView from './ExploreView.js';
import RouteView from './RouteView.js';
import Navbar from './navbar/Navbar.js';

import { readUser } from './userUtils.js';

function App() {
  const [authState, setAuthState] = useState({ ready: false });
  const [tripIds, setTripIds] = useState([]);

  return (
    <Router>
      <Authenticator
        authState={authState}
        onChange={setAuthState}
        setTripIds={setTripIds}
      >
        <Navbar authState={authState} />
        <Switch>
          <Route exact path="/">
            <SearchView loggedIn={authState.loggedIn} tripIds={tripIds} />
          </Route>
          <Route path="/explore">
            <ExploreView />
          </Route>
          <Route path="/route">
            <RouteView loggedIn={authState.loggedIn} />
          </Route>
        </Switch>
      </Authenticator>
    </Router>
  );
}

function Authenticator({ children, onChange, setTripIds }) {
  const location = useLocation();
  const redirectUrl = encodeURIComponent(`${location.pathname}${location.search}`);
  const [userEmail, setUserEmail] = useState(null);
  useEffect(
    () => {
      fetch(`/api/v1/auth?redirect=${redirectUrl}`)
        .then((response) => response.json())
        .then(({ loggedIn, loginUrl, logoutUrl, userEmail }) => {
          onChange({ ready: true, loggedIn, loginUrl, logoutUrl });
          setUserEmail(userEmail);
        });
    },
    /* Don't refetch on rerender. */ [redirectUrl, onChange]
  );

  useEffect(() => {
    if (userEmail) {
      readUser(userEmail).then((userData) => {
        if (userData.tripIds !== 'null') {
          setTripIds(userData.tripIds);
        }
      });
    }
  }, [userEmail, setTripIds]);

  return <>{children}</>;
}

export default App;
