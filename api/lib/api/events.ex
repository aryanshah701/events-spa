defmodule Api.Events do
  @moduledoc """
  The Events context.
  """

  import Ecto.Query, warn: false
  alias Api.Repo

  alias Api.Events.Event

  @doc """
  Returns the list of events.

  ## Examples

      iex> list_events()
      [%Event{}, ...]

  """
  def list_events do
    Repo.all(Event)
  end

  @doc """
  Gets a single event.

  Raises `Ecto.NoResultsError` if the Event does not exist.

  ## Examples

      iex> get_event!(123)
      %Event{}

      iex> get_event!(456)
      ** (Ecto.NoResultsError)

  """
   def get_event!(id) do
    event = Repo.get!(Event, id)
    event = event 
    |> Repo.preload(:comments)
    |> load_stats()
    |> Repo.preload(:user)
    event
  end

  def get_event(id) do
    event = Repo.get(Event, id)
    if event do
      # Preload events
      event = event 
      |> Repo.preload(:comments)
      |> load_stats()
      |> Repo.preload(:user)

      event  
    end
  end

  # Load the stats of the event(invites, yes, no etc)
  def load_stats(%Event{} = event) do
    event = Repo.preload(event, :invites)

    # Compute the count of each response
    yes_responses = Enum.filter(event.invites, fn invite -> invite.response == "yes" end)
    no_responses = Enum.filter(event.invites, fn invite -> invite.response == "no" end)
    maybe_responses = Enum.filter(event.invites, fn invite -> invite.response == "maybe" end)
    no_response_responses = Enum.reject(event.invites, 
      fn invite -> 
        invite.response == "yes" || 
          invite.response == "no" || 
          invite.response == "maybe" 
      end)

    num_invites = Enum.count(event.invites)
    num_yes = Enum.count(yes_responses)
    num_no = Enum.count(no_responses)
    num_maybe = Enum.count(maybe_responses)
    num_no_response = Enum.count(no_response_responses)

    event = Map.replace(event, :num_invites, num_invites)
    event = Map.replace(event, :num_yes, num_yes)
    event = Map.replace(event, :num_no, num_no)
    event = Map.replace(event, :num_maybe, num_maybe)
    event = Map.replace(event, :num_no_response, num_no_response)

    event
  end

  @doc """
  Creates a event.

  ## Examples

      iex> create_event(%{field: value})
      {:ok, %Event{}}

      iex> create_event(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_event(attrs \\ %{}) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a event.

  ## Examples

      iex> update_event(event, %{field: new_value})
      {:ok, %Event{}}

      iex> update_event(event, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_event(%Event{} = event, attrs) do
    event
    |> Event.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a event.

  ## Examples

      iex> delete_event(event)
      {:ok, %Event{}}

      iex> delete_event(event)
      {:error, %Ecto.Changeset{}}

  """
  def delete_event(%Event{} = event) do
    Repo.delete(event)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking event changes.

  ## Examples

      iex> change_event(event)
      %Ecto.Changeset{data: %Event{}}

  """
  def change_event(%Event{} = event, attrs \\ %{}) do
    Event.changeset(event, attrs)
  end
end
