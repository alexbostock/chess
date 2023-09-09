import {
  Piece,
  potentialCaptureMoves,
  potentialNonCaptureMoves,
} from "./Piece";
import Position, { positionFromEncodedCoordinates } from "./Position";

describe("potentialCaptureMoves", () => {
  test("white pawn captures diagonally from left file", () => {
    const moves = potentialCaptureMoves({
      colour: "white",
      type: "pawn",
      position: new Position(0, 3),
    });
    const expected = [new Position(1, 4)];
    expect(moves).toEqual(expected);
  });

  test("white pawn captures diagonally from right file", () => {
    const moves = potentialCaptureMoves({
      colour: "white",
      type: "pawn",
      position: new Position(7, 1),
    });
    const expected = [new Position(6, 2)];
    expect(moves).toEqual(expected);
  });

  test("white pawn captures diagonally from non-edge files", () => {
    const moves = potentialCaptureMoves({
      colour: "white",
      type: "pawn",
      position: new Position(3, 6),
    });
    const expected = [new Position(2, 7), new Position(4, 7)];
    expect(moves).toEqual(expected);
  });

  test("black pawn captures diagonally", () => {
    const moves = potentialCaptureMoves({
      colour: "black",
      type: "pawn",
      position: new Position(2, 4),
    });
    const expected = [new Position(1, 3), new Position(3, 3)];
    expect(moves).toEqual(expected);
  });

  test("bishops' potential capture moves are the same as potential non-capture moves", () => {
    const piece: Piece = {
      colour: "white",
      type: "bishop",
      position: new Position(3, 6),
    };
    const moves = potentialCaptureMoves(piece);
    const expected = potentialNonCaptureMoves(piece);
    expect(moves).toEqual(expected);
  });

  test("knights' potential capture moves are the same as potential non-capture moves", () => {
    const piece: Piece = {
      colour: "black",
      type: "knight",
      position: new Position(2, 4),
    };
    const moves = potentialCaptureMoves(piece);
    const expected = potentialNonCaptureMoves(piece);
    expect(moves).toEqual(expected);
  });

  test("rooks' potential capture moves are the same as potential non-capture moves", () => {
    const piece: Piece = {
      colour: "white",
      type: "rook",
      position: new Position(1, 7),
    };
    const moves = potentialCaptureMoves(piece);
    const expected = potentialNonCaptureMoves(piece);
    expect(moves).toEqual(expected);
  });

  test("queens' potential capture moves are the same as potential non-capture moves", () => {
    const piece: Piece = {
      colour: "white",
      type: "queen",
      position: new Position(0, 0),
    };
    const moves = potentialCaptureMoves(piece);
    const expected = potentialNonCaptureMoves(piece);
    expect(moves).toEqual(expected);
  });

  test("kings' potential capture moves are the same as potential non-capture moves", () => {
    const piece: Piece = {
      colour: "black",
      type: "king",
      position: new Position(3, 2),
    };
    const moves = potentialCaptureMoves(piece);
    const expected = potentialNonCaptureMoves(piece);
    expect(moves).toEqual(expected);
  });
});

describe("potentialNonCaptureMoves", () => {
  test("white pawn moves forward one square", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "pawn",
      position: new Position(3, 3),
    });
    const expected = [new Position(3, 4)];
    expect(moves).toEqual(expected);
  });

  test("black pawn moves forward one square", () => {
    const moves = potentialNonCaptureMoves({
      colour: "black",
      type: "pawn",
      position: new Position(2, 5),
    });
    const expected = [new Position(2, 4)];
    expect(moves).toEqual(expected);
  });

  test("white pawns can move forward two squares from their starting rows", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "pawn",
      position: positionFromEncodedCoordinates("A2"),
    });
    const expected = [
      positionFromEncodedCoordinates("A3"),
      positionFromEncodedCoordinates("A4"),
    ];
    expect(moves).toEqual(expected);
  });

  test("black pawns can move forward two squares from their starting rows", () => {
    const moves = potentialNonCaptureMoves({
      colour: "black",
      type: "pawn",
      position: positionFromEncodedCoordinates("A7"),
    });
    const expected = [
      positionFromEncodedCoordinates("A5"),
      positionFromEncodedCoordinates("A6"),
    ];
    expect(moves).toEqual(expected);
  });

  test("bishop moves diagonally from a corner", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "bishop",
      position: new Position(0, 0),
    });
    const expected = [
      new Position(1, 1),
      new Position(2, 2),
      new Position(3, 3),
      new Position(4, 4),
      new Position(5, 5),
      new Position(6, 6),
      new Position(7, 7),
    ];
    expect(moves).toEqual(expected);
  });

  test("bishop moves diagonally from a non-corner", () => {
    const moves = potentialNonCaptureMoves({
      colour: "black",
      type: "bishop",
      position: new Position(3, 5),
    });
    const expected = [
      new Position(0, 2),
      new Position(1, 3),
      new Position(1, 7),
      new Position(2, 4),
      new Position(2, 6),
      new Position(4, 4),
      new Position(4, 6),
      new Position(5, 3),
      new Position(5, 7),
      new Position(6, 2),
      new Position(7, 1),
    ];
    expect(moves).toEqual(expected);
  });

  test("knight moves to two spaces from a corner", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "knight",
      position: new Position(0, 7),
    });
    const expected = [new Position(1, 5), new Position(2, 6)];
    expect(moves).toEqual(expected);
  });

  test("knight moves to eight spaces from the centre", () => {
    const moves = potentialNonCaptureMoves({
      colour: "black",
      type: "knight",
      position: new Position(4, 4),
    });
    const expected = [
      new Position(2, 3),
      new Position(2, 5),
      new Position(3, 2),
      new Position(3, 6),
      new Position(5, 2),
      new Position(5, 6),
      new Position(6, 3),
      new Position(6, 5),
    ];
    expect(moves).toEqual(expected);
  });
  test("rook moves horizontally and vertically", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "rook",
      position: new Position(3, 4),
    });
    const expected = [
      new Position(0, 4),
      new Position(1, 4),
      new Position(2, 4),
      new Position(3, 0),
      new Position(3, 1),
      new Position(3, 2),
      new Position(3, 3),
      new Position(3, 5),
      new Position(3, 6),
      new Position(3, 7),
      new Position(4, 4),
      new Position(5, 4),
      new Position(6, 4),
      new Position(7, 4),
    ];
    expect(moves).toEqual(expected);
  });

  test("queen moves horizontally, verticall and diagonally", () => {
    const moves = potentialNonCaptureMoves({
      colour: "white",
      type: "queen",
      position: new Position(0, 0),
    });
    const expected = [
      new Position(0, 1),
      new Position(0, 2),
      new Position(0, 3),
      new Position(0, 4),
      new Position(0, 5),
      new Position(0, 6),
      new Position(0, 7),
      new Position(1, 0),
      new Position(1, 1),
      new Position(2, 0),
      new Position(2, 2),
      new Position(3, 0),
      new Position(3, 3),
      new Position(4, 0),
      new Position(4, 4),
      new Position(5, 0),
      new Position(5, 5),
      new Position(6, 0),
      new Position(6, 6),
      new Position(7, 0),
      new Position(7, 7),
    ];
    expect(moves).toEqual(expected);
  });

  test("king moves one square in any direction", () => {
    const moves = potentialNonCaptureMoves({
      colour: "black",
      type: "king",
      position: new Position(3, 3),
    });
    const expected = [
      new Position(2, 2),
      new Position(2, 3),
      new Position(2, 4),
      new Position(3, 2),
      new Position(3, 4),
      new Position(4, 2),
      new Position(4, 3),
      new Position(4, 4),
    ];
    expect(moves).toEqual(expected);
  });
});
