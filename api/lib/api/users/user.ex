defmodule Api.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    # Associations
    has_many :events, Api.Events.Event
    has_many :comments, Api.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email])
    |> validate_password(attrs["password"])
    |> hash_password(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
    |> unique_constraint(:email)
  end

  # Add the hash of the password onto the changeset
  def hash_password(changeset, password) do
    if password do
      change(changeset, Argon2.add_hash(password))
    else
      changeset
    end
  end

  # Validate the password 
  def validate_password(changeset, password) do
    if String.length(password) < 8 do
      add_error(changeset, :password, "too short")
    else
      changeset
    end
  end

end
