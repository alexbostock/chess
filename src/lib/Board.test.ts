import Board, { Move, Piece, PieceColour, PieceType } from "./Board";
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

describe("starting moves", () => {
  test("white pawns can move on turn one", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B2"),
        toPosition: positionFromEncodedCoordinates("B3"),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("D2"),
        toPosition: positionFromEncodedCoordinates("D3"),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("D2"),
        toPosition: positionFromEncodedCoordinates("D4"),
      })
    ).toBe(true);
  });

  test("white knights can move on turn one", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B1"),
        toPosition: positionFromEncodedCoordinates("A3"),
      })
    ).toBe(true);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B1"),
        toPosition: positionFromEncodedCoordinates("C3"),
      })
    ).toBe(true);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("G1"),
        toPosition: positionFromEncodedCoordinates("F3"),
      })
    ).toBe(true);
  });

  test("white cannot make illegal pawn moves", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B2"),
        toPosition: positionFromEncodedCoordinates("B5"),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B2"),
        toPosition: positionFromEncodedCoordinates("C3"),
      })
    ).toBe(false);
  });

  test("white cannot move blocked pieces", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C1"),
        toPosition: positionFromEncodedCoordinates("D2"),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C1"),
        toPosition: positionFromEncodedCoordinates("E3"),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("H1"),
        toPosition: positionFromEncodedCoordinates("H4"),
      })
    ).toBe(false);
  });

  test("black pieces cannot move on turn one", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("F7"),
        toPosition: positionFromEncodedCoordinates("F6"),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("G8"),
        toPosition: positionFromEncodedCoordinates("F6"),
      })
    );
  });

  test("empty squares cannot move", () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("A3"),
        toPosition: positionFromEncodedCoordinates("A4"),
      })
    ).toBe(false);
  });
});

describe("capturing", () => {
  test("rook can capture within the same rank", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("H1"),
        },
        {
          colour: "white",
          type: "rook",
          position: positionFromEncodedCoordinates("C3"),
        },
        {
          colour: "black",
          type: "rook",
          position: positionFromEncodedCoordinates("E3"),
        },
      ],
      "white"
    );
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C3"),
        toPosition: positionFromEncodedCoordinates("E3"),
      })
    ).toBe(true);
  });

  test("rook cannot capture when blocked", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("H1"),
        },
        {
          colour: "white",
          type: "rook",
          position: positionFromEncodedCoordinates("C3"),
        },
        {
          colour: "white",
          type: "bishop",
          position: positionFromEncodedCoordinates("D3"),
        },
        {
          colour: "black",
          type: "knight",
          position: positionFromEncodedCoordinates("E3"),
        },
      ],
      "white"
    );
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C3"),
        toPosition: positionFromEncodedCoordinates("E3"),
      })
    ).toBe(false);
  });

  test("pawn can capture on diagonal", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("H1"),
        },
        {
          colour: "white",
          type: "pawn",
          position: positionFromEncodedCoordinates("C3"),
        },
        {
          colour: "white",
          type: "pawn",
          position: positionFromEncodedCoordinates("D3"),
        },
        {
          colour: "black",
          type: "pawn",
          position: positionFromEncodedCoordinates("C4"),
        },
      ],
      "black"
    );

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C4"),
        toPosition: positionFromEncodedCoordinates("D3"),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("C4"),
        toPosition: positionFromEncodedCoordinates("C3"),
      })
    ).toBe(false);
  });
});

describe("check", () => {
  test("black is in check from bishop", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: new Position(0, 0),
        },
        {
          colour: "black",
          type: "king",
          position: new Position(0, 7),
        },
        {
          colour: "white",
          type: "bishop",
          position: new Position(2, 5),
        },
      ],
      "black"
    );
    expect(board.playerInCheck("black")).toBe(true);
  });

  test("check from bishop blocked by rook", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: new Position(0, 0),
        },
        {
          colour: "black",
          type: "king",
          position: new Position(0, 7),
        },
        {
          colour: "white",
          type: "bishop",
          position: new Position(2, 5),
        },
        {
          colour: "black",
          type: "rook",
          position: new Position(1, 6),
        },
      ],
      "black"
    );
    expect(board.playerInCheck("black")).toBe(false);
  });

  test("white is in check from knight", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: new Position(3, 3),
        },
        {
          colour: "black",
          type: "king",
          position: new Position(5, 5),
        },
        {
          colour: "black",
          type: "knight",
          position: new Position(2, 1),
        },
      ],
      "white"
    );
    expect(board.playerInCheck("white")).toBe(true);
  });
});

describe("check", () => {
  test("king cannot move into check", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: new Position(1, 1),
        },
        {
          colour: "black",
          type: "king",
          position: new Position(3, 3),
        },
      ],
      "white"
    );
    expect(
      board.isLegalMove({
        fromPosition: new Position(1, 1),
        toPosition: new Position(2, 2),
      })
    ).toBe(false);
  });

  test("pawn cannot move to reveal check", () => {
    const board = new Board([
      {
        colour: "white",
        type: "king",
        position: positionFromEncodedCoordinates("A1"),
      },
      {
        colour: "black",
        type: "king",
        position: positionFromEncodedCoordinates("H1"),
      },
      {
        colour: "white",
        type: "pawn",
        position: positionFromEncodedCoordinates("B2"),
      },
      {
        colour: "black",
        type: "bishop",
        position: positionFromEncodedCoordinates("C3"),
      },
    ]);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B2"),
        toPosition: positionFromEncodedCoordinates("B3"),
      })
    ).toBe(false);
    // But can capture attacker
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates("B2"),
        toPosition: positionFromEncodedCoordinates("C3"),
      })
    ).toBe(true);
  });

  test("black must move out of check", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("F6"),
        },
        {
          colour: "black",
          type: "bishop",
          position: positionFromEncodedCoordinates("B2"),
        },
        {
          colour: "black",
          type: "bishop",
          position: positionFromEncodedCoordinates("B3"),
        },
        {
          colour: "white",
          type: "pawn",
          position: positionFromEncodedCoordinates("F4"),
        },
      ],
      "white"
    );

    const kingMoveFromCheckToCheck: Move = {
      fromPosition: positionFromEncodedCoordinates("A1"),
      toPosition: positionFromEncodedCoordinates("A2"),
    };
    expect(board.isLegalMove(kingMoveFromCheckToCheck)).toBe(false);

    const kingMoveOutOfCheck: Move = {
      fromPosition: positionFromEncodedCoordinates("A1"),
      toPosition: positionFromEncodedCoordinates("B1"),
    };
    expect(board.isLegalMove(kingMoveOutOfCheck)).toBe(true);

    const kingMoveOutOfCheckAndCapture: Move = {
      fromPosition: positionFromEncodedCoordinates("A1"),
      toPosition: positionFromEncodedCoordinates("B2"),
    };
    expect(board.isLegalMove(kingMoveOutOfCheckAndCapture)).toBe(true);

    const pawnMove: Move = {
      fromPosition: positionFromEncodedCoordinates("F4"),
      toPosition: positionFromEncodedCoordinates("F5"),
    };
    expect(board.isLegalMove(pawnMove)).toBe(false);
  });
});

describe("allLegalMoves", () => {
  it("lists all legal moves in a scenario", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("A8"),
        },
        {
          colour: "white",
          type: "pawn",
          position: positionFromEncodedCoordinates("A2"),
        },
        {
          colour: "black",
          type: "pawn",
          position: positionFromEncodedCoordinates("B3"),
        },
      ],
      "white"
    );
    const legalMoves = board.allLegalMoves();
    const expected: Move[] = [
      {
        fromPosition: positionFromEncodedCoordinates("A1"),
        toPosition: positionFromEncodedCoordinates("B1"),
      },
      {
        fromPosition: positionFromEncodedCoordinates("A1"),
        toPosition: positionFromEncodedCoordinates("B2"),
      },
      {
        fromPosition: positionFromEncodedCoordinates("A2"),
        toPosition: positionFromEncodedCoordinates("A3"),
      },
      {
        fromPosition: positionFromEncodedCoordinates("A2"),
        toPosition: positionFromEncodedCoordinates("A4"),
      },
      {
        fromPosition: positionFromEncodedCoordinates("A2"),
        toPosition: positionFromEncodedCoordinates("B3"),
      },
    ];
    expect(legalMoves).toEqual(expected);
  });

  it("identifies stalemate", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("F8"),
        },
        {
          colour: "black",
          type: "queen",
          position: positionFromEncodedCoordinates("B3"),
        },
      ],
      "white"
    );
    expect(board.allLegalMoves()).toHaveLength(0);
    expect(board.isStalemate()).toBe(true);
    expect(board.isCheckmate()).toBe(false);
  });

  it("identifies checkmate", () => {
    const board = new Board(
      [
        {
          colour: "white",
          type: "king",
          position: positionFromEncodedCoordinates("C3"),
        },
        {
          colour: "white",
          type: "queen",
          position: positionFromEncodedCoordinates("B2"),
        },
        {
          colour: "black",
          type: "king",
          position: positionFromEncodedCoordinates("A1"),
        },
      ],
      "black"
    );

    expect(board.allLegalMoves()).toHaveLength(0);
    expect(board.isCheckmate()).toBe(true);
    expect(board.isStalemate()).toBe(false);
  });
});
