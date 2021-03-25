defmodule Api.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :email, :string
    field :response, :string

    # Associations
    belongs_to :event, Api.Events.Event

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :email, :event_id])
    |> validate_required([:response, :email, :event_id])
    |> validate_response(:response)
  end

  # Ensure that the given response is either yes, no, or maybe
  def validate_response(changeset, field, options \\ []) do
    validate_change(changeset, field, fn _, response ->
      response = String.downcase(response)
      if response != "yes" && response != "no" && response != "maybe" do
        [{field, options[:message] || "Invalid response string. Should be one of yes, no or maybe"}]
      else
        []
      end
    end)
  end

end
