defmodule ApiWeb.CommentView do
  use ApiWeb, :view
  alias ApiWeb.CommentView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment_without_assoc.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("show_without_assoc.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment_without_assoc.json")}
  end

  def render("comment.json", %{comment: comment}) do
    user_json = ApiWeb.UserView.render("show_without_assoc.json", user: comment.user)
    event_json = ApiWeb.CommentView.render("show_without_assoc.json", event: comment.event)

    %{id: comment.id,
      content: comment.content,
      user: user_json,
      event: event_json,
      }
  end

  def render("comment_without_assoc.json", %{comment: comment}) do
    %{id: comment.id,
      content: comment.content,
      event: comment.event_id
      }
  end
end
