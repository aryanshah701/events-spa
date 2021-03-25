defmodule Api.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :content, :string

    # Associations
    belongs_to :user, Api.Users.User
    belongs_to :event, Api.Events.Event

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:content, :user_id, :event_id])
    |> validate_required([:content, :user_id, :event_id])
  end
end
