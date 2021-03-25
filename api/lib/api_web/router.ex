defmodule ApiWeb.Router do
  use ApiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ApiWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  # API endpoints

  # Version 1
  scope "/api/v1", ApiWeb do
    pipe_through :api
    
    resources "/users", UserController, except: [:new, :edit]
    resources "/events", EventController, except: [:new, :edit]
    resources "/comments", CommentController, except: [:new, :edit]
    resources "/invites", InviteController, except: [:new, :edit]
    resources "/session", SessionController, only: [:create]
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: ApiWeb.Telemetry
    end
  end
end
