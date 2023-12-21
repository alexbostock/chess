import { useState } from 'react';
import Board from './Board';
import BoardState from './lib/Board';

function App() {
  const [board, setBoard] = useState(new BoardState());
  return (
    <div>
      <Board
        board={board}
        move={(move) => setBoard(board.moveIsPromotion(move) ? board.makeMove(move, 'queen') : board.makeMove(move))}
      />
    </div>
  );
}

export default App;
