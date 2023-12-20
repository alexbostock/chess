import BoardState from './lib/Board';
import { Piece } from './lib/Piece';
import Position, { RowOrFileNumber, allRowsOrFiles } from './lib/Position';

export default function Board(props: { board: BoardState }) {
  const rows = allRowsOrFiles.map((rowNumber) => row(props.board, rowNumber));
  const possibleMoves = props.board.allLegalMoves();

  const possibleMovesList = possibleMoves.length ? (
    <>
      <p>Possible moves:</p>
      <ul>
        {possibleMoves.map(({ fromPosition, toPosition }) => (
          <li>{`${fromPosition.encodedCoordinate} to ${toPosition.encodedCoordinate}`}</li>
        ))}
      </ul>
    </>
  ) : (
    <></>
  );

  return (
    <div className="game-view">
      <div className="game-sidebar">
        <p>Next player to move: {props.board.nextToMove}</p>
        {possibleMovesList}
      </div>

      <div className="board">{rows}</div>
    </div>
  );
}

function row(board: BoardState, rowNumber: RowOrFileNumber) {
  const cells = allRowsOrFiles.map((columnNumber) =>
    cell(board.pieceAtPosition(new Position(columnNumber, rowNumber)))
  );
  return <div className="board-row">{cells}</div>;
}

function cell(piece: Piece | undefined) {
  return <div className="board-cell">{cellContent(piece)}</div>;
}

function cellContent(piece: Piece | undefined) {
  if (!piece) {
    return '';
  }

  if (piece.colour === 'white') {
    switch (piece.type) {
      case 'king':
        return '♔';
      case 'queen':
        return '♕';
      case 'bishop':
        return '♗';
      case 'knight':
        return '♘';
      case 'rook':
        return '♖';
      case 'pawn':
        return '♙';
    }
  } else {
    switch (piece.type) {
      case 'king':
        return '♚';
      case 'queen':
        return '♛';
      case 'bishop':
        return '♝';
      case 'knight':
        return '♞';
      case 'rook':
        return '♜';
      case 'pawn':
        return '♟';
    }
  }
}
