import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'

import store from './store'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser } from './actions/authActions'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Check for token
if (localStorage.jwtToken) {
  // Set token to auth header
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user infor and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))
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
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
