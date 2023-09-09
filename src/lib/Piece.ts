import Position, {
  allValidPositions,
  isValidRowOrFileNumber,
} from "./Position";

export type PieceColour = "white" | "black";
export type PieceType =
  | "pawn"
  | "bishop"
  | "knight"
  | "rook"
  | "queen"
  | "king";

export interface Piece {
  colour: PieceColour;
  type: PieceType;
  position: Position;
}

export function potentialCaptureMoves(piece: Piece): readonly Position[] {
  switch (piece.type) {
    case "pawn":
      const p = piece.position;
      return allValidPositions.filter(({ x, y }) => {
        const nextRow = piece.colour === "white" ? p.y + 1 : p.y - 1;
        return y === nextRow && Math.abs(x - p.x) === 1;
      });
    default:
      return potentialNonCaptureMoves(piece);
  }
}

export function potentialNonCaptureMoves(piece: Piece): readonly Position[] {
  const p = piece.position;
  switch (piece.type) {
    case "pawn":
      return allValidPositions.filter(({ x, y }) => {
        const startingRow = piece.colour === "white" ? 1 : 6;
        const currentRow = p.y;
        const nextRow =
          piece.colour === "white" ? currentRow + 1 : currentRow - 1;
        const twoRowsAhead =
          piece.colour === "white" ? nextRow + 1 : nextRow - 1;
        return (
          (y === nextRow ||
            (currentRow === startingRow && y === twoRowsAhead)) &&
          x === p.x
        );
      });
    case "bishop":
      return allValidPositions.filter(
        ({ x, y }) => Math.abs(x - p.x) === Math.abs(y - p.y) && x !== p.x
      );
    case "knight":
      return allValidPositions.filter(({ x, y }) => {
        const xDiff = Math.abs(x - p.x);
        const yDiff = Math.abs(y - p.y);
        return (xDiff === 1 && yDiff === 2) || (xDiff === 2 && yDiff === 1);
      });
    case "rook":
      return allValidPositions.filter(
        ({ x, y }) => (x === p.x || y === p.y) && !(x === p.x && y === p.y)
      );
    case "queen":
      return allValidPositions.filter(
        ({ x, y }) =>
          (x === p.x || y === p.y || Math.abs(x - p.x) === Math.abs(y - p.y)) &&
          !(x === p.x && y === p.y)
      );
    case "king":
      return allValidPositions.filter(({ x, y }) => {
        const xDiff = Math.abs(x - p.x);
        const yDiff = Math.abs(y - p.y);
        return (xDiff === 1 && yDiff <= 1) || (yDiff === 1 && xDiff <= 1);
      });
  }
}
