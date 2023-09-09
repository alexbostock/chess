import Board, { Piece, PieceColour, PieceType } from "./Board";
import Position, { positionFromEncodedCoordinates } from "./Position";

describe("Default initial state", () => {
  test("white is first to move", () => {
    const board = new Board();
    expect(board.nextToMove).toBe("white");
  });

  test("board is setup as standard", () => {
    const board = new Board();

    function expectHasPieceAtPosition(
      colour: PieceColour,
      type: PieceType,
      encodedCoords: string
    ) {
      const position = positionFromEncodedCoordinates(encodedCoords);
      const piece = board.pieceAtPosition(position);
      expect(piece).toEqual({
        colour,
        type,
        position,
      });
    }

    expectHasPieceAtPosition("white", "rook", "A1");
    expectHasPieceAtPosition("white", "knight", "B1");
    expectHasPieceAtPosition("white", "bishop", "C1");
    expectHasPieceAtPosition("white", "queen", "D1");
    expectHasPieceAtPosition("white", "king", "E1");
    expectHasPieceAtPosition("white", "bishop", "F1");
    expectHasPieceAtPosition("white", "knight", "G1");
    expectHasPieceAtPosition("white", "rook", "H1");
    expectHasPieceAtPosition("white", "pawn", "A2");
    expectHasPieceAtPosition("white", "pawn", "B2");
    expectHasPieceAtPosition("white", "pawn", "C2");
    expectHasPieceAtPosition("white", "pawn", "D2");
    expectHasPieceAtPosition("white", "pawn", "E2");
    expectHasPieceAtPosition("white", "pawn", "F2");
    expectHasPieceAtPosition("white", "pawn", "G2");
    expectHasPieceAtPosition("white", "pawn", "H2");
    expectHasPieceAtPosition("black", "rook", "A8");
    expectHasPieceAtPosition("black", "knight", "B8");
    expectHasPieceAtPosition("black", "bishop", "C8");
    expectHasPieceAtPosition("black", "queen", "D8");
    expectHasPieceAtPosition("black", "king", "E8");
    expectHasPieceAtPosition("black", "bishop", "F8");
    expectHasPieceAtPosition("black", "knight", "G8");
    expectHasPieceAtPosition("black", "rook", "H8");
    expectHasPieceAtPosition("black", "pawn", "A7");
    expectHasPieceAtPosition("black", "pawn", "B7");
    expectHasPieceAtPosition("black", "pawn", "C7");
    expectHasPieceAtPosition("black", "pawn", "D7");
    expectHasPieceAtPosition("black", "pawn", "E7");
    expectHasPieceAtPosition("black", "pawn", "F7");
    expectHasPieceAtPosition("black", "pawn", "G7");
    expectHasPieceAtPosition("black", "pawn", "H7");

    const sampleEmptySquares = ["A3", "C4", "D4", "F5", "F6"];
    for (const coords of sampleEmptySquares) {
      const position = positionFromEncodedCoordinates(coords);
      expect(board.pieceAtPosition(position)).toBeUndefined();
    }
  });
});

describe("Custom state validation", () => {
  it("throws on construction if several pieces occupy the same square", () => {
    const pieces: Piece[] = [
      {
        colour: "white",
        type: "king",
        position: new Position(0, 0),
      },
      {
        colour: "white",
        type: "king",
        position: new Position(0, 0),
      },
    ];
    expect(() => new Board(pieces)).toThrow();
  });

  it("throws on construction if either player has no king", () => {
    expect(() => new Board([])).toThrow();

    const pieces: Piece[] = [
      {
        colour: "white",
        type: "king",
        position: new Position(1, 1),
      },
    ];
    expect(() => new Board(pieces)).toThrow();
  });

  it("throws on construction if the last player to move is in check", () => {
    const pieces: Piece[] = [
      {
        colour: "white",
        type: "king",
        position: new Position(0, 0),
      },
      {
        colour: "black",
        type: "king",
        position: new Position(7, 7),
      },
      {
        colour: "white",
        type: "rook",
        position: new Position(0, 7),
      },
    ];
    expect(() => new Board(pieces, "white")).toThrow();
  });

  it("does not (necessarily) throw on construction if player to move is in check", () => {
    const pieces: Piece[] = [
      {
        colour: "white",
        type: "king",
        position: new Position(0, 0),
      },
      {
        colour: "black",
        type: "king",
        position: new Position(7, 7),
      },
      {
        colour: "white",
        type: "rook",
        position: new Position(0, 7),
      },
    ];
    const board = new Board(pieces, "black");
    expect(board.playerInCheck("white")).toBe(false);
    expect(board.playerInCheck("black")).toBe(true);
  });
});
