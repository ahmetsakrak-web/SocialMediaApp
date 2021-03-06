import './App.css';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Fragment, useEffect } from 'react';
import {Provider} from "react-redux";
import store from "./store";
import Alert from "./components/layout/Alert";
import {loadUser} from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute"
import CreateProfile from "./components/profile-form/CreateProfile";

function App() {
if(localStorage.token){
  setAuthToken(localStorage.token);
}
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);


  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
          <Alert />
              <Switch>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/Register" component={Register}/>
                  <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                  <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
              </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
