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
  const userId = state.session.id;
  getRequest("/users/" + userId);
}
