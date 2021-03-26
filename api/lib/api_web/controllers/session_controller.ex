# Implemented using Tuck notes 0323 session_controller.ex
defmodule ApiWeb.SessionController do
  use ApiWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    # Authenticate the user
    authenticated_user = Api.Users.authenticate(email, password)

    if authenticated_user do
      # If authentication succesfull, send back a session with a token
      session = %{
        token: Phoenix.Token.sign(conn, "user_id", authenticated_user.id),
        name: authenticated_user.name,
        id: authenticated_user.id,
        user_email: authenticated_user.email,
      }

      conn 
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :created,
        Jason.encode!(%{session: session})
      )
    else 
      # If not, send back an unautherised message
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "incorrect username or password"})
      )
    end
  end

  end