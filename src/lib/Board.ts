import { potentialCaptureMoves, potentialNonCaptureMoves } from "./Piece";
import Position, {
  allRowsOrFiles,
  allValidPositions,
  findPositionsBetween,
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

export interface Move {
  fromPosition: Position;
  toPosition: Position;
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

  constructor(pieces?: Piece[], nextToMove?: PieceColour) {
    this.pieces = pieces ?? createDefaultPieces();
    this.nextToMove = nextToMove ?? "white";

    if (!this.hasLegalState()) {
      throw new Error("Illegal position");
    }
  }

  pieceAtPosition(position: Position): Piece | undefined {
    for (const piece of this.pieces) {
      if (piece.position.x === position.x && piece.position.y === position.y) {
        return piece;
      }
    }
  }

  hasLegalState(): boolean {
    const occupiedCoords = new Set<string>();
    for (const piece of this.pieces) {
      const coords = piece.position.encodedCoordinate;
      if (occupiedCoords.has(coords)) {
        return false;
      }
      occupiedCoords.add(coords);
    }

    const whiteKings = this.pieces.filter(
      ({ colour, type }) => colour === "white" && type === "king"
    );
    const blackKings = this.pieces.filter(
      ({ colour, type }) => colour === "black" && type === "king"
    );
    if (whiteKings.length !== 1 || blackKings.length !== 1) {
      return false;
    }

    const justMovedPlayer = this.nextToMove === "white" ? "black" : "white";
    if (this.playerInCheck(justMovedPlayer)) {
      return false;
    }

    return true;
  }

  playerInCheck(kingColour: PieceColour): boolean {
    const king = this.pieces.find(
      ({ colour, type }) => colour === kingColour && type === "king"
    );
    if (!king) {
      throw new Error("Internal error: invalid state");
    }
    const opposingPieces = this.pieces.filter(
      (piece) => piece.colour !== kingColour
    );
    for (const piece of opposingPieces) {
      for (const capturePosition of potentialCaptureMoves(piece)) {
        const threatensKing =
          capturePosition.x === king.position.x &&
          capturePosition.y === king.position.y;
        if (threatensKing && !this.isBlocked(piece, capturePosition)) {
          return true;
        }
      }
    }

    return false;
  }

  // TODO: en passant
  // TODO: castling

  isLegalMove(move: Move): boolean {
    const piece = this.pieces.find(
      ({ position: { x, y } }) =>
        x === move.fromPosition.x && y === move.fromPosition.y
    );
    if (!piece) {
      return false;
    }
    if (piece.colour !== this.nextToMove) {
      return false;
    }
    const pieceAtDestination = this.pieces.find(
      ({ position: { x, y } }) =>
        x === move.toPosition.x && y === move.toPosition.y
    );
    if (pieceAtDestination && piece.colour === pieceAtDestination.colour) {
      return false;
    }
    const potentialMoves = pieceAtDestination
      ? potentialCaptureMoves(piece)
      : potentialNonCaptureMoves(piece);
    const canMoveToTarget = !!potentialMoves.find(
      ({ x, y }) => x === move.toPosition.x && y === move.toPosition.y
    );
    if (!canMoveToTarget) {
      return false;
    }
    if (this.isBlocked(piece, move.toPosition)) {
      return false;
    }

    const boardStateAfterMove = this.clone();
    boardStateAfterMove.nextToMove =
      this.nextToMove === "white" ? "black" : "white";
    boardStateAfterMove.pieces = boardStateAfterMove.pieces.filter(
      ({ position: { x, y } }) =>
        !(x === move.toPosition.x && y === move.toPosition.y)
    );
    const movedPiece = boardStateAfterMove.pieces.find(
      ({ position: { x, y } }) =>
        x === move.fromPosition.x && y === move.fromPosition.y
    );
    if (!movedPiece) {
      throw Error("Internal error: should never occur");
    }
    movedPiece.position = move.toPosition;
    if (!boardStateAfterMove.hasLegalState()) {
      return false;
    }

    return true;
  }

  allLegalMoves() {
    const currentPlayersPieces = this.pieces.filter(
      ({ colour }) => colour === this.nextToMove
    );
    const allLegalMoves: Move[] = [];
    for (const piece of currentPlayersPieces) {
      for (const toPosition of allValidPositions) {
        const move = {
          fromPosition: piece.position,
          toPosition,
        };
        if (this.isLegalMove(move)) {
          allLegalMoves.push(move);
        }
      }
    }
    return allLegalMoves;
  }

  isStalemate() {
    return (
      this.allLegalMoves().length === 0 && !this.playerInCheck(this.nextToMove)
    );
  }

  isCheckmate() {
    return (
      this.allLegalMoves().length === 0 && this.playerInCheck(this.nextToMove)
    );
  }

  isBlocked(piece: Piece, destination: Position) {
    if (piece.type === "knight") {
      return false;
    }
    const squaresBetween = findPositionsBetween(piece.position, destination);
    for (const square of squaresBetween) {
      for (const piece of this.pieces) {
        if (square.x === piece.position.x && square.y === piece.position.y) {
          return true;
        }
      }
    }
    return false;
  }

  clone(): Board {
    const clonedPieces = this.pieces.map((piece) => ({ ...piece }));
    return new Board(clonedPieces, this.nextToMove);
  }
}
