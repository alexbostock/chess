import BoardState from "./lib/Board";
import Position, {
  RowOrFileNumber,
  allRowsOrFiles,
  allValidPositions,
} from "./lib/Position";
import { Piece } from "./lib/Piece";

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
    <div>
      <p>Next player to move: {props.board.nextToMove}</p>
      {possibleMovesList}
      <div style={{ fontSize: "3em" }}>{rows}</div>
    </div>
  );
}

function row(board: BoardState, rowNumber: RowOrFileNumber) {
  const cells = allRowsOrFiles.map((columnNumber) =>
    cell(board.pieceAtPosition(new Position(columnNumber, rowNumber)))
  );
  return <div style={{ display: "flex", flexDirection: "row" }}>{cells}</div>;
}

function cell(piece: Piece | undefined) {
  return (
    <div style={{ height: "50px", width: "50px" }}>{cellContent(piece)}</div>
  );
}

function cellContent(piece: Piece | undefined) {
  if (!piece) {
    return "";
  }

  if (piece.colour === "white") {
    switch (piece.type) {
      case "king":
        return "♔";
      case "queen":
        return "♕";
      case "bishop":
        return "♗";
      case "knight":
        return "♘";
      case "rook":
        return "♖";
      case "pawn":
        return "♙";
    }
  } else {
    switch (piece.type) {
      case "king":
        return "♚";
      case "queen":
        return "♛";
      case "bishop":
        return "♝";
      case "knight":
        return "♞";
      case "rook":
        return "♜";
      case "pawn":
        return "♟";
    }
  }
}
