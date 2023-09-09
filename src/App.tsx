import Board from "./Board";
import BoardState from "./lib/Board";

function App() {
  return (
    <div>
      <Board board={new BoardState()} />
    </div>
  );
}

export default App;
