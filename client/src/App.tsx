import Digits from "./components/Digits";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <h1>Digit recognizer</h1>
      <div
        style={{ width: "300px", height: "300px", border: "solid black 2px" }}
      ></div>
      <Digits />
    </div>
  );
}

export default App;
