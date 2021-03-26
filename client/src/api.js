// File for all the AJAX fetch functions to the Events SPA API
import store from "./store";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://events-api.aryanshah.tech/api/v1"
    : "http://localhost:4000/api/v1";

async function postRequest(endpoint, body) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  if (!session) {
    const errorAction = {
      type: "error/set",
      data: "Sorry you need to be logged in for this.",
    };

    store.dispatch(errorAction);
    return false;
  }

  const userId = session.id;
  const token = session.token;

  // Make the post request and dispatch the data if successful
  const isSuccess = getRequest("/users/" + userId, token)
    .then((userData) => {
      const action = {
        type: "user/set",
        data: userData,
      };

      store.dispatch(action);

      return true;
    })
    .catch((err) => {
      console.log("err", err);
      return false;
    });

  return isSuccess;
}

// Fetch all the events the user is authorised to see
export function fetchEvents() {}

export async function fetchEventData(eventId) {
  const state = store.getState();
  const session = state.session;

  // If the user is not logged in, dispatch error
  if (!session) {
    const errorAction = {
      type: "error/set",
      data: "Sorry you need to be logged in for this.",
    };

    store.dispatch(errorAction);
    return null;
  }

  // If the user is logged in, attempt to fetch the event data
  const token = state.session.token;
  return await getRequest("/events/" + eventId, token);
}
