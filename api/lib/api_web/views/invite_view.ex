defmodule ApiWeb.InviteView do
  use ApiWeb, :view
  alias ApiWeb.InviteView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "invite.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    event_json = ApiWeb.EventView.render("show_without_assoc.json", invite.event)

    %{id: invite.id,
      response: invite.response,
      event: event_json,
      email: invite.email,
      }
  end
end
