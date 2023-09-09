import Position, { allRowsOrFiles } from "./Position";

export type PieceColour = "white" | "black";
export type PieceType =
  | "pawn"
  | "bishop"
  | "knight"
  | "rook"
  | "queen"
  | "king";

interface Piece {
  colour: PieceColour;
  type: PieceType;
  position: Position;
}

function createDefaultPieces(): Piece[] {
  const whitePawns: Piece[] = allRowsOrFiles.map((x) => ({
    colour: "white",
    type: "pawn",
    position: new Position(x, 1),
  }));
  const blackPawns: Piece[] = allRowsOrFiles.map((x) => ({
    colour: "black",
    type: "pawn",
    position: new Position(x, 6),
  }));
  return [
    ...whitePawns,
    ...blackPawns,
    { position: new Position(0, 0), colour: "white", type: "rook" },
    { position: new Position(0, 7), colour: "black", type: "rook" },
    { position: new Position(1, 0), colour: "white", type: "knight" },
    { position: new Position(1, 7), colour: "black", type: "knight" },
    { position: new Position(2, 0), colour: "white", type: "bishop" },
    { position: new Position(2, 7), colour: "black", type: "bishop" },
    { position: new Position(3, 0), colour: "white", type: "queen" },
    { position: new Position(3, 7), colour: "black", type: "queen" },
    { position: new Position(4, 0), colour: "white", type: "king" },
    { position: new Position(4, 7), colour: "black", type: "king" },
    { position: new Position(5, 0), colour: "white", type: "bishop" },
    { position: new Position(5, 7), colour: "black", type: "bishop" },
    { position: new Position(6, 0), colour: "white", type: "knight" },
    { position: new Position(6, 7), colour: "black", type: "knight" },
    { position: new Position(7, 0), colour: "white", type: "rook" },
    { position: new Position(7, 7), colour: "black", type: "rook" },
  ];
}

export default class Board {
  private pieces: Piece[];
  nextToMove: PieceColour;

  constructor() {
    this.pieces = createDefaultPieces();
    this.nextToMove = "white";
  }

  pieceAtPosition(position: Position): Piece | undefined {
    for (const piece of this.pieces) {
      if (piece.position.x === position.x && piece.position.y === position.y) {
        return piece;
      }
    }
  }
}
