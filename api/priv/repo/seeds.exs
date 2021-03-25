# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs

alias Api.Repo
alias Api.Users.User
alias Api.Events.Event

# Seeding users
user1 = Repo.insert!(%User{
  name: "user1", email: "user1@gmail.com", password_hash: Argon2.hash_pwd_salt("user1")
})

user2 = Repo.insert!(%User{
  name: "user2", email: "user2@gmail.com", password_hash: Argon2.hash_pwd_salt("user2")
})

user3 = Repo.insert!(%User{
  name: "user3", email: "user3@gmail.com", password_hash: Argon2.hash_pwd_salt("user3")
})

# Creating seed datetimes
{:ok, datetime1} = NaiveDateTime.new(2021, 5, 1, 16, 0, 0)
{:ok, datetime2} = NaiveDateTime.new(2021, 6, 1, 16, 0, 0)
{:ok, datetime3} = NaiveDateTime.new(2021, 7, 1, 16, 0, 0)

# Seeding Events
event1 = %Event{
  name: "Event 1",
  description: "This is the first event's description",
  date: datetime1,
  user_id: user1.id,
}

event2 = %Event{
  name: "Event 2",
  description: "This is the second event's description",
  date: datetime2,
  user_id: user2.id,
}

event3 = %Event{
  name: "Event 3",
  description: "This is the third event's description",
  date: datetime3,
  user_id: user3.id,
}

Repo.insert!(event1)
Repo.insert!(event2)
Repo.insert!(event3)

