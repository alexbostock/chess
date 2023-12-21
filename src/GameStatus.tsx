import type Board from './lib/Board';

export default function GameStatus({ board }: { board: Board }) {
  if (board.isCheckmate()) {
    const winner = board.nextToMove === 'white' ? 'Black' : 'White';
    return <p>{winner} wins</p>;
  } else if (board.isStalemate()) {
    return <p>Stalemate</p>;
  } else {
    return <p>Next player to move: {board.nextToMove}</p>;
  }
}
