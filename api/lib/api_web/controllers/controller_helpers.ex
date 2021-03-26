defmodule ApiWeb.ControllerHelpers do
  def parse_datetime(str_date) do
    # Split string to get the date and time
    datetime_info = String.split(str_date, "T")
    date = Enum.at(datetime_info, 0)
    time = Enum.at(datetime_info, 1)

    # Get the year, month, and day
    {year, month, day} = parse_date(date)

    # Get the 24 hour, minute, second
    {hour, minute, second} = parse_time(time)

    # Create the datetime object
    {:ok, datetime} = NaiveDateTime.new(year, month, day, hour, minute, second)
    
    datetime
  end

  # Parses a date string into year, month, day
  def parse_date(date) do
    date_info = String.split(date, "-")
    {year, _} = Integer.parse(Enum.at(date_info, 0))
    {month, _} = Integer.parse(Enum.at(date_info, 1))
    {day, _} = Integer.parse(Enum.at(date_info, 2))
    {year, month, day}
  end

  # Parses a time string into hour, minute, second
  def parse_time(time) do
    time_info = String.split(time, ":")
    {hour, _} = Integer.parse(Enum.at(time_info, 0))
    {minute, _} = Integer.parse(Enum.at(time_info, 1))
    second = 0

    # Adding 4 hours to correct timezone
    hour = hour + 4
    {hour, minute, second}
  end 
end