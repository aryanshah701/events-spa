defmodule ApiWeb.UserView do
  use ApiWeb, :view
  alias ApiWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user_without_assoc.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("show_without_assoc.json", %{user: user}) do
    %{data: render_one(user, UserView, "user_without_assoc.json")}
  end

  def render("user.json", %{user: user}) do
  events_json = ApiWeb.EventView.render("index.json", events: user.events)
  comments_json = ApiWeb.CommentView.render("index.json", comments: user.comments);

    %{id: user.id,
      name: user.name,
      email: user.email,
      events: events_json,
      comments: comments_json}
  end

  def render("user_without_assoc.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email
    }
  end
end
