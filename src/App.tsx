import Board from "./Board";
import BoardState from "./lib/Board";

function App() {
  return (
    <div style={{ fontSize: "3em" }}>
      <Board board={new BoardState()} />
    </div>
  );
}

export default App;
