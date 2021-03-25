defmodule Api.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :date, :naive_datetime
    field :description, :string
    field :name, :string

    # Virtual fields
    field :num_invites, :integer, virtual: true
    field :num_yes, :integer, virtual: true
    field :num_no, :integer, virtual: true
    field :num_maybe, :integer, virtual: true
    field :num_no_response, :integer, virtual: true

    # Associations
    belongs_to :user, Api.Users.User
    has_many :comments, Api.Comments.Comment
    has_many :invites, Api.Invites.Invite

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:name, :date, :description, :user_id])
    |> validate_required([:name, :date, :description, :user_id])
    |> validate_date(:date)
  end

  # Ensures the datetime chosen is sometime in the future
  def validate_date(changeset, field, options \\ []) do
    current_datetime = NaiveDateTime.utc_now()

    validate_change(changeset, field, fn _, date ->
      if date != nil && NaiveDateTime.compare(current_datetime, date) == :gt do
        [{field, options[:message] || "Invalid date and time"}]
      else
        []
      end
    end)
  end
end
