// Design of functions taken from Tuck notes 0323 store.js

// File for redux reducer functions
import { createStore, combineReducers } from "redux";

// Events reducer
function events(state = [], action) {
  switch (action.type) {
    case "events/set":
      return action.data;
    default:
      return state;
  }
}

// Users reducer
function users(state = [], action) {
  switch (action.type) {
    case "users/set":
      return action.data;
    default:
      return state;
  }
}

// User reducer(authenticated user data)
function user(state = null, action) {
  switch (action.type) {
    case "user/set":
      return action.data;
    default:
      return state;
  }
}

// Loads session from local storage if it exists
function loadSession() {
  let session = localStorage.getItem("session");

  // If session doesn't exist, return null
  if (!session) {
    return null;
  }

  session = JSON.parse(session);

  // Check if the session has expired
  const maxTime = 24 * 60 * 60 * 1000;
  const timeElapsed = Date.now() - session.timestamp;
  if (timeElapsed > maxTime) {
    return null;
  }

  // Return the session if it exists and hasn't expired
  return session;
}

// Saves the given session to local storage with the timestamp of the save
function saveSessionToLocalStorage(session) {
  const sessionWithTime = {
    ...session,
    timestamp: Date.now(),
  };
  localStorage.setItem("session", JSON.stringify(sessionWithTime));
}

// Session reducer
function session(state = loadSession(), action) {
  switch (action.type) {
    case "session/set":
      saveSessionToLocalStorage(action.data);
      return action.data;
    case "session/logout":
      console.log("store logout");
      localStorage.removeItem("session");
      return null;
    default:
      return state;
  }
}

// Error flash reducer
function error(state = "", action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    default:
      return null;
  }
}

// Success flash reducer
function success(state = "", action) {
  switch (action.type) {
    case "success/set":
      return action.data;
    default:
      return null;
  }
}

// Root reducer
function rootReducer(state, action) {
  const reducers = combineReducers({
    users,
    events,
    user,
    session,
    error,
    success,
  });

  const updatedState = reducers(state, action);
  return updatedState;
}

const store = createStore(rootReducer);
export default store;
