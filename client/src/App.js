import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'

import store from './store'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'

import PrivateRoute from './components/common/PrivateRoute'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts'
import Post from './components/post/Post'


// Check for token
if (localStorage.jwtToken) {
  // Set token to auth header
  setAuthToken(localStorage.jwtToken);

  // Decode token and get user infor and expiration
  const decoded = jwt_decode(localStorage.jwtToken);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // TODO: Clear current profile
    store.dispatch(clearCurrentProfile());

    // Redirect to Login
    window.location.href = "/login"
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className="container">
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/profile/:handle' component={Profile} />
            <Switch>
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/add-education' component={AddEducation} />
            </Switch>
            <Route exact path='/not-found' component={NotFound} />
            <Switch>
              <PrivateRoute exact path='/feed' component={Posts} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/post/:id' component={Post} />
            </Switch>
            <Route exact path='/not-found' component={NotFound} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
