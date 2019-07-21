import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

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
