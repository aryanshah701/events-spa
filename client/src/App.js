// Styles
import "./App.scss";
import { Container } from "react-bootstrap";

// React router and components
import { Switch, Route } from "react-router-dom";
import NavBar from "./Components/Nav";
import ShowUser from "./Components/Users/Show";
import NewUser from "./Components/Users/New";
import LoginUser from "./Components/Users/Login";

export default function App() {
  return (
    <Container className="my-5">
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <LoginUser />
        </Route>
        <Route path="/users/show" exact>
          <ShowUser />
        </Route>
        <Route path="/users/new" exact>
          <NewUser />
        </Route>
        <Route path="/login" exact>
          <LoginUser />
        </Route>
      </Switch>
    </Container>
  );
}
