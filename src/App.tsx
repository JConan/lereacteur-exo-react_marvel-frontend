import logo from "./assets/images/logo.png";
import "./App.scss";
import Menu from "./components/Menu";
import { Redirect, Route, Switch } from "react-router-dom";
import Characters from "./pages/Characters";
import Comics from "./pages/Comics";

const Test = (text: string) => () => <div className="sample">{text}</div>;

function App() {
  return (
    <div className="App">
      <div className="Logo">
        <img src={logo} alt="Logo" />
      </div>
      <Menu />
      <Switch>
        <Route path="/characters" component={Characters} />
        <Route path="/comics" component={Comics} />
        <Route path="/bookmark" component={Test("Bookmark")} />
        <Redirect path="*" to="/characters" />
      </Switch>
    </div>
  );
}

export default App;
