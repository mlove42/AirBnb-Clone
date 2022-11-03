import React, { useState, useEffect } from "react";
import "./index.css";

import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import SignupFormPage from "./components/Forms/SignupFormPage";
import LoginFormPage from "./components/Forms/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import Spots from "./components/Spots";
import CreateSpotForm from "./components/Forms/CreateSpotForm/CreateSpot";
import ManageSpots from "./components/Spots/ManageSpots/ManageSpots";
import ViewSpots from "./components/Spots/ViewSpots";
import Footer from "./components/Footer/Footer";
function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <div className="app">
        {location?.pathname !== "/create-spot" && (
          <Navigation isLoaded={isLoaded} />
        )}
        {isLoaded && (
          <Switch>
            <Route exact path="/login">
              <LoginFormPage />
            </Route>
            <Route exact path="/">
              <Spots />
            </Route>
            <Route exact path="/create-spot">
              <CreateSpotForm />
            </Route>
            <Route exact path="/manage-listings/spots">
              <ManageSpots />
            </Route>
            <Route exact path="/spots/:spotId">
              <ViewSpots />
            </Route>
            <Route exact path="/signup">
              <SignupFormPage />
            </Route>
          </Switch>
        )}
        {location?.pathname !== "/create-spot" && <Footer />}
      </div>
    )
  );
}

export default App;
