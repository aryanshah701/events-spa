defmodule Api.Repo.Migrations.CreateInvites do
  use Ecto.Migration

  def change do
    create table(:invites) do
      add :response, :string, null: false
      add :email, :string, null: false
      add :event_id, references(:events, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:invites, [:event_id])

    # Invites to an event and user are unqiue
    create unique_index(:invites, [:email, :event_id], name: :unique_idx)
  end
end
