import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'

import store from './store'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'

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
          <Route exact path='/' component={Landing}></Route>
          <div className="container">
            <Route exact path='/register' component={Register}></Route>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/dashboard' component={Dashboard}></Route>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
