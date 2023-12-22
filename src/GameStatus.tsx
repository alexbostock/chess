import type Board from './lib/Board';

export default function GameStatus({ board }: { board: Board }) {
  if (board.isCheckmate()) {
    const winner = board.nextToMove === 'white' ? 'Black' : 'White';
    return <p className="game-status">{winner} wins</p>;
  } else if (board.isStalemate()) {
    return <p className="game-status">Stalemate</p>;
  } else {
    return <p className="game-status">Next player to move: {board.nextToMove}</p>;
  }
}
