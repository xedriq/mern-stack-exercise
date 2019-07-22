import { GET_ERRORS, SET_CURRENT_USER } from './types'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

// Register a User
export const registeruser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        }))
};

// Login and get token
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            // Save credentials/token to local storage
            const { token } = res.data
            localStorage.setItem('jwtToken', token)

            // Token to auth header
            setAuthToken(token)

            // Decode token to get user data
            const decoded = jwt_decode(token)

            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        }))
}

// Set Logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log out user
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // Remove token from auth header 
    setAuthToken(false);

    // Set current user to {} and set isAuthenticated to false
    dispatch(setCurrentUser({}));
}