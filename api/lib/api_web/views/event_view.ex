defmodule ApiWeb.EventView do
  use ApiWeb, :view
  alias ApiWeb.EventView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event_without_assoc.json")}
  end
  
  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("show_without_assoc.json", %{event: event}) do
    %{data: render_one(event, EventView, "event_without_assoc.json")}
  end

  def render("event.json", %{event: event}) do
    comments_json = ApiWeb.CommentView.render("index.json", comments: event.comments)
    user_json = ApiWeb.UserView.render("show_without_assoc.json", user: event.user)
    invite_json = ApiWeb.InviteView.render("index.json", invites: event.invites)

    %{id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      num_invites: event.num_invites,
      num_no: event.num_no,
      num_yes: event.num_yes,
      num_maybe: event.num_maybe,
      num_no_response: event.num_no_response,
      comments: comments_json,
      invites: invite_json,
      user: user_json
      }
  end

  def render("event_without_assoc.json", %{event: event}) do
    %{id: event.id,
      name: event.name,
      date: event.date,
      description: event.description
      }
  end
end
