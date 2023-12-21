import Board from './lib/Board';
import { moveToNotation, pairedMoves } from './lib/move-history';

export default function MoveHistory(props: { board: Board }) {
  const moves = props.board.pastMoves.map(moveToNotation);
  if (!props.board.previousMove?.gameEnd) {
    moves.push('');
  }

  return (
    <table>
      <tbody>
        {pairedMoves(moves).map((row, rowNumber) => (
          <tr key={rowNumber}>
            <td key="index">{rowNumber + 1}</td>
            {row.map((move, index) => (
              <td key={index}>{move}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
