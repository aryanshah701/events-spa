// File for all the AJAX fetch functions to the Events SPA API
import store from "./store";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://events-api.aryanshah.tech/api/v1"
    : "http://localhost:4000/api/v1";

async function postRequest(endpoint, body, token = "") {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": token,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(apiUrl + endpoint, options);

  return await response.json();
}

async function getRequest(endpoint, token) {
  const options = {
    method: "GET",
    headers: {
      "x-auth": token,
    },
  };

  const repsonse = await fetch(apiUrl + endpoint, options);

  return await repsonse.json();
}

// Authenticate the user and recieve the session token
export async function apiLogin(email, password) {
  // Make the POST request to create a session
  const isSuccess = postRequest("/session", {
    email: email,
    password: password,
  })
    .then((response) => {
      if (response.session) {
        // If the authentication is successful, dispatch the session
        const sessionAction = {
          data: response.session,
          type: "session/set",
        };

        const successAction = {
          data: "Login successful",
          type: "success/set",
        };

        store.dispatch(sessionAction);
        store.dispatch(successAction);

        return true;
      } else {
        // If the authentication is not successful, dispatch the an error
        const errorAction = {
          data: response.error,
          type: "error/set",
        };

        store.dispatch(errorAction);

        return false;
      }
    })
    .catch((err) => console.log("auth failed", err));

  return isSuccess;
}

// Registers a new user
export async function apiRegister(newUser) {
  const isSuccess = postRequest("/users", { user: newUser }).then(
    (response) => {
      if (response.data) {
        // Registeration was successful, dispatch a success
        return true;
      } else {
        // If the authentication is not successful, dispatch an error
        const err = getRegisterationError(response);

        if (err !== "") {
          const errorAction = {
            data: err,
            type: "error/set",
          };

          store.dispatch(errorAction);
        }

        return false;
      }
    }
  );

  return isSuccess;
}

// Generate an error string from the response object
function getRegisterationError(response) {
  if (response.errors) {
    const errors = response.errors;
    if (errors.email) {
      return "Email: " + errors.email[0];
    }

    if (errors.password) {
      return "Password: " + errors.password[0];
    }

    return "";
  }
}

// Fetch all user data and dispatch it to the store
export function fetchUserData() {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return false;
  }

  const userId = session.id;
  const token = session.token;

  // Make the get request and dispatch the data if successful
  const isSuccess = getRequest("/users/" + userId, token)
    .then((userData) => {
      const action = {
        type: "user/set",
        data: userData,
      };

      store.dispatch(action);

      // Fetch the user's events
      const eventsFetched = fetchEvents();

      return eventsFetched;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });

  return isSuccess;
}

// Fetch all the events the user is authorised to see
export function fetchEvents() {
  let state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!isLoggedIn(session)) {
    return false;
  }

  console.log("State", state);

  if (!state.user) {
    return false;
  }

  // If the user is logged in, fetch the event info for all events
  const user = state.user.data;
  const token = session.token;
  const events = user.events.data;
  let isSuccess = true;

  console.log("Fetching all events(API)", events);
  for (const eventData of events) {
    const fetchSuccess = fetchEventData(eventData.id, token);
    isSuccess = isSuccess && fetchSuccess;
  }

  return isSuccess;
}

function isLoggedIn(session) {
  // If the user is not logged in, dispatch error
  if (!session) {
    const errorAction = {
      type: "error/set",
      data: "Sorry you need to be logged in for this.",
    };

    store.dispatch(errorAction);
    return false;
  }

  return true;
}

export function fetchEventData(eventId, token) {
  // Make the get request and dispatch the data if successful
  const isSuccess = getRequest("/events/" + eventId, token)
    .then((eventData) => {
      const action = {
        type: "events/add",
        data: eventData,
      };

      console.log("Fetched event data", eventData);

      store.dispatch(action);

      return true;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });

  return isSuccess;
}

export async function apiCreateNewEvent(event) {
  // Get the user id from the session and at it to the event
  const state = store.getState();
  const session = state.session;

  // Ensure that the user is logged in
  if (!isLoggedIn(session)) {
    return null;
  }

  const token = session.token;
  const userId = session.id;

  const newEvent = {
    ...event,
    user_id: userId,
  };

  const isSuccess = postRequest("/events", { event: newEvent }, token).then(
    (response) => {
      if (response.data) {
        // Event creation was successful
        console.log(response.data);
        return response.data.id;
      } else {
        // If the event creation is not successful, dispatch an error
        const err = getEventCreateError(response.errors);

        if (err !== "") {
          const errorAction = {
            data: err,
            type: "error/set",
          };

          store.dispatch(errorAction);
        }

        return null;
      }
    }
  );

  return isSuccess;
}

function getEventCreateError(errors) {
  if (errors.description) {
    return "Description: " + errors.description[0];
  }

  if (errors.name) {
    return "Name: " + errors.name[0];
  }

  if (errors.date) {
    return "Date: " + errors.date[0];
  }
}

export function fetchData() {
  fetchUserData();
}
