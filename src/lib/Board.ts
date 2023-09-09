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

export interface HistoricalMove extends Move {
  piece: {
    colour: PieceColour;
    type: PieceType;
  };
  capture: boolean;
  specialMove?:
    | {
        enPassant: true;
      }
    | {
        promotion?: PieceType;
      }
    | {
        castling?: "king-side" | "queen-side";
      };
  attackOnKing?: "check" | "checkmate" | "stalemate";
  gameEnd?: "white-wins" | "black-wins" | "draw";
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
  pastMoves: HistoricalMove[]; // Oldest first

  constructor(
    pieces?: Piece[],
    nextToMove?: PieceColour,
    pastMoves?: HistoricalMove[]
  ) {
    this.pieces = pieces ?? createDefaultPieces();
    this.nextToMove = nextToMove ?? "white";
    // TODO: validate pastMoves consistent with pieces (if both provided)?
    this.pastMoves = pastMoves ?? [];

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

  get previousMove() {
    return this.pastMoves.at(-1);
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

  isLegalMove(move: Move): boolean {
    if (this.isLegalEnPassantMove(move) || this.isLegalCastlingMove(move)) {
      return true;
    }
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

  isLegalEnPassantMove(move: Move): boolean {
    const piece = this.pieces.find(
      ({ position: { x, y } }) =>
        x === move.fromPosition.x && y === move.fromPosition.y
    );
    if (!piece || piece.type !== "pawn") {
      return false;
    }
    if (piece.colour !== this.nextToMove) {
      return false;
    }

    const targetFile = move.toPosition.x;

    // Rank numbers are 0-indexed!
    const positionOfPieceBeingCaptured =
      this.nextToMove === "white"
        ? new Position(targetFile, 4)
        : new Position(targetFile, 3);
    const previousPositionOfPieceBeingCaptured =
      this.nextToMove === "white"
        ? new Position(targetFile, 6)
        : new Position(targetFile, 1);

    const validPreviousMove =
      this.previousMove &&
      this.previousMove.fromPosition.x ===
        previousPositionOfPieceBeingCaptured.x &&
      this.previousMove.fromPosition.y ===
        previousPositionOfPieceBeingCaptured.y &&
      this.previousMove.toPosition.x === positionOfPieceBeingCaptured.x &&
      this.previousMove.toPosition.y === positionOfPieceBeingCaptured.y;

    if (!validPreviousMove) {
      return false;
    }

    const validFromPosition =
      Math.abs(move.fromPosition.x - targetFile) === 1 &&
      move.fromPosition.y === positionOfPieceBeingCaptured.y;
    if (!validFromPosition) {
      return false;
    }

    const boardStateAfterMove = this.clone();
    boardStateAfterMove.nextToMove =
      this.nextToMove === "white" ? "black" : "white";
    boardStateAfterMove.pieces = boardStateAfterMove.pieces.filter(
      ({ position: { x, y } }) =>
        !(
          x === positionOfPieceBeingCaptured.x &&
          y === positionOfPieceBeingCaptured.y
        )
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

  isLegalCastlingMove(move: Move): boolean {
    const castlingRow = move.fromPosition.y;
    const kingFile = 4;

    const isTwoSpaceHorizontalMoveFromKingStartSquare =
      move.fromPosition.x === kingFile &&
      (castlingRow === 0 || castlingRow === 7) &&
      Math.abs(move.toPosition.x - move.fromPosition.x) === 2 &&
      move.toPosition.y === castlingRow;

    if (!isTwoSpaceHorizontalMoveFromKingStartSquare) {
      return false;
    }

    const king = this.pieces.find(
      ({ colour, type, position: { x, y } }) =>
        colour === this.nextToMove &&
        type === "king" &&
        x === kingFile &&
        y === castlingRow
    );
    const expectedRookFile = move.toPosition.x > kingFile ? 7 : 0;
    const rook = this.pieces.find(
      ({ colour, type, position: { x, y } }) =>
        colour === this.nextToMove &&
        type === "rook" &&
        x === expectedRookFile &&
        y === castlingRow
    );
    if (!king || !rook) {
      return false;
    }

    if (this.isBlocked(king, rook.position)) {
      return false;
    }

    if (this.playerInCheck(this.nextToMove)) {
      return false;
    }

    const boardStateAfterMove = this.clone();
    boardStateAfterMove.nextToMove =
      this.nextToMove === "white" ? "black" : "white";
    const kingBeingMoved = boardStateAfterMove.pieces.find(
      ({ colour, type }) => colour === this.nextToMove && type === "king"
    );
    const rookBeingMoved = boardStateAfterMove.pieces.find(
      ({ position: { x, y } }) => x === expectedRookFile && y === castlingRow
    );
    if (!kingBeingMoved || !rookBeingMoved) {
      throw new Error("Internal error: should never occur");
    }

    // Moving through check
    const kingIntermediateFile = move.toPosition.x > kingFile ? 5 : 3;
    kingBeingMoved.position = new Position(kingIntermediateFile, castlingRow);
    if (boardStateAfterMove.playerInCheck(this.nextToMove)) {
      return false;
    }

    kingBeingMoved.position = move.toPosition;
    const rookDestinationFile = move.toPosition.x === 6 ? 5 : 3;
    rookBeingMoved.position = new Position(rookDestinationFile, castlingRow);
    if (!boardStateAfterMove.hasLegalState()) {
      return false;
    }

    const kingAlreadyMoved = this.pastMoves.some(
      ({ piece: { colour, type } }) =>
        colour === this.nextToMove && type === "king"
    );
    const rookAlreadyMoved = this.pastMoves.some(
      ({ piece: { colour, type }, toPosition: { x, y } }) =>
        colour === this.nextToMove &&
        type === "rook" &&
        x === rook.position.x &&
        y === rook.position.y
    );
    if (kingAlreadyMoved || rookAlreadyMoved) {
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
