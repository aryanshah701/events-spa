defmodule ApiWeb.EventController do
  use ApiWeb, :controller

  alias Api.Events
  alias Api.Events.Event
  alias ApiWeb.Plugs

  action_fallback ApiWeb.FallbackController

  plug Plugs.RequireAuth, "en" when action in [:index, :create, :show, :update, :delete]

  # Checks if the authenticated user is the owner of the given event
  def user_owner?(conn, event) do
    logged_in_user_id = conn.assigns[:user].id
    owner_user_id = event.user_id
    logged_in_user_id == owner_user_id
  end

  # Checks if the authenticated user is the owner/invite of the given event
  def user_owner_or_invite?(conn, event) do
    logged_in_user_id = conn.assigns[:user]

    user_owner?(conn, event) || Enum.any?(event.invites, 
      fn invite -> invite.email == logged_in_user_id.email end)
  end

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    date_str = event_params["date"]
    parsed_date_str = ApiWeb.ControllerHelpers.parse_datetime(date_str)
    IO.inspect parsed_date_str

    event_params = event_params
    |> Map.replace("date", parsed_date_str)

    with {:ok, %Event{} = event} <- Events.create_event(event_params) do
      event = Events.get_event(event.id)
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.event_path(conn, :show, event))
      |> render("show.json", event: event)
    end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    # Ensure the user is the host or invite of the event
    if user_owner_or_invite?(conn, event) do
      render(conn, "show.json", event: event)
    else
      # If not, send back unautherised message
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Sorry, you need to be the host/invite of the event."})
      )
    end
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)
    
    # Ensure that the user is the owner of the event
    if user_owner?(conn, event) do
      with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
        render(conn, "show.json", event: event)
      end
    else 
      # If not, send back an unautherised message
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Sorry, you need to be the host to update the event."})
      )
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    # Ensure that the user is the owner of the event
    if user_owner?(conn, event) do
      with {:ok, %Event{}} <- Events.delete_event(event) do
        send_resp(conn, :no_content, "")
      end
    else
      # If not, send back an unautherised message
        conn
        |> put_resp_header(
          "content-type",
          "application/json; charset=UTF-8")
        |> send_resp(
          :unauthorized,
          Jason.encode!(%{error: "Sorry, you need to be the host to delete the event."})
        )
    end

  end
end
