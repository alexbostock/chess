import Board from './lib/Board';
import { moveToNotation, pairedMoves } from './lib/move-history';

export default function MoveHistory(props: { board: Board }) {
  const moves = props.board.pastMoves.map(moveToNotation);
  if (!props.board.previousMove?.gameEnd) {
    moves.push('');
  }

  return (
    <table className="move-history">
      <tbody>
        <tr key="header">
          <td></td>
          <td>White</td>
          <td>Black</td>
        </tr>
        {pairedMoves(moves).map((row, rowNumber) => (
          <tr key={rowNumber}>
            <td key="index">{rowNumber + 1}</td>
            {row.map((move, index) => (
              <td key={index}>{move}</td>
            ))}
          </tr>
        ))}
        {result(props.board)}
      </tbody>
    </table>
  );
}

function result(board: Board): JSX.Element {
  if (board.isCheckmate()) {
    const score = board.nextToMove === 'white' ? '0 - 1' : '1 - 0';
    return (
      <tr>
        <td colSpan={3}>{score}</td>
      </tr>
    );
  } else if (board.isStalemate()) {
    return (
      <tr>
        <td colSpan={3}>&#x00BD; - &#x00BD;</td>
      </tr>
    );
  } else {
    return <></>;
  }
}
