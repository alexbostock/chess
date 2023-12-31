import Board, { HistoricalMove, Move, Piece, PieceColour, PieceType } from './Board';
import Position, { positionFromEncodedCoordinates } from './Position';

describe('Default initial state', () => {
  test('white is first to move', () => {
    const board = new Board();
    expect(board.nextToMove).toBe('white');
  });

  test('board is setup as standard', () => {
    const board = new Board();

    function expectHasPieceAtPosition(colour: PieceColour, type: PieceType, encodedCoords: string) {
      const position = positionFromEncodedCoordinates(encodedCoords);
      const piece = board.pieceAtPosition(position);
      expect(piece).toEqual({
        colour,
        type,
        position,
      });
    }

    expectHasPieceAtPosition('white', 'rook', 'A1');
    expectHasPieceAtPosition('white', 'knight', 'B1');
    expectHasPieceAtPosition('white', 'bishop', 'C1');
    expectHasPieceAtPosition('white', 'queen', 'D1');
    expectHasPieceAtPosition('white', 'king', 'E1');
    expectHasPieceAtPosition('white', 'bishop', 'F1');
    expectHasPieceAtPosition('white', 'knight', 'G1');
    expectHasPieceAtPosition('white', 'rook', 'H1');
    expectHasPieceAtPosition('white', 'pawn', 'A2');
    expectHasPieceAtPosition('white', 'pawn', 'B2');
    expectHasPieceAtPosition('white', 'pawn', 'C2');
    expectHasPieceAtPosition('white', 'pawn', 'D2');
    expectHasPieceAtPosition('white', 'pawn', 'E2');
    expectHasPieceAtPosition('white', 'pawn', 'F2');
    expectHasPieceAtPosition('white', 'pawn', 'G2');
    expectHasPieceAtPosition('white', 'pawn', 'H2');
    expectHasPieceAtPosition('black', 'rook', 'A8');
    expectHasPieceAtPosition('black', 'knight', 'B8');
    expectHasPieceAtPosition('black', 'bishop', 'C8');
    expectHasPieceAtPosition('black', 'queen', 'D8');
    expectHasPieceAtPosition('black', 'king', 'E8');
    expectHasPieceAtPosition('black', 'bishop', 'F8');
    expectHasPieceAtPosition('black', 'knight', 'G8');
    expectHasPieceAtPosition('black', 'rook', 'H8');
    expectHasPieceAtPosition('black', 'pawn', 'A7');
    expectHasPieceAtPosition('black', 'pawn', 'B7');
    expectHasPieceAtPosition('black', 'pawn', 'C7');
    expectHasPieceAtPosition('black', 'pawn', 'D7');
    expectHasPieceAtPosition('black', 'pawn', 'E7');
    expectHasPieceAtPosition('black', 'pawn', 'F7');
    expectHasPieceAtPosition('black', 'pawn', 'G7');
    expectHasPieceAtPosition('black', 'pawn', 'H7');

    const sampleEmptySquares = ['A3', 'C4', 'D4', 'F5', 'F6'];
    for (const coords of sampleEmptySquares) {
      const position = positionFromEncodedCoordinates(coords);
      expect(board.pieceAtPosition(position)).toBeUndefined();
    }
  });
});

describe('Custom state validation', () => {
  it('throws on construction if several pieces occupy the same square', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: new Position(0, 0),
      },
      {
        colour: 'white',
        type: 'king',
        position: new Position(0, 0),
      },
    ];
    expect(() => new Board(pieces)).toThrow();
  });

  it('throws on construction if either player has no king', () => {
    expect(() => new Board([])).toThrow();

    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: new Position(1, 1),
      },
    ];
    expect(() => new Board(pieces)).toThrow();
  });

  it('throws on construction if the last player to move is in check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: new Position(0, 0),
      },
      {
        colour: 'black',
        type: 'king',
        position: new Position(7, 7),
      },
      {
        colour: 'white',
        type: 'rook',
        position: new Position(0, 7),
      },
    ];
    expect(() => new Board(pieces, 'white')).toThrow();
  });

  it('does not (necessarily) throw on construction if player to move is in check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: new Position(0, 0),
      },
      {
        colour: 'black',
        type: 'king',
        position: new Position(7, 7),
      },
      {
        colour: 'white',
        type: 'rook',
        position: new Position(0, 7),
      },
    ];
    const board = new Board(pieces, 'black');
    expect(board.playerInCheck('white')).toBe(false);
    expect(board.playerInCheck('black')).toBe(true);
  });
});

describe('starting moves', () => {
  test('white pawns can move on turn one', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('B3'),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('D2'),
        toPosition: positionFromEncodedCoordinates('D3'),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('D2'),
        toPosition: positionFromEncodedCoordinates('D4'),
      })
    ).toBe(true);
  });

  test('white knights can move on turn one', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B1'),
        toPosition: positionFromEncodedCoordinates('A3'),
      })
    ).toBe(true);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B1'),
        toPosition: positionFromEncodedCoordinates('C3'),
      })
    ).toBe(true);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('G1'),
        toPosition: positionFromEncodedCoordinates('F3'),
      })
    ).toBe(true);
  });

  test('white cannot make illegal pawn moves', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('B5'),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('C3'),
      })
    ).toBe(false);
  });

  test('white cannot move blocked pieces', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C1'),
        toPosition: positionFromEncodedCoordinates('D2'),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C1'),
        toPosition: positionFromEncodedCoordinates('E3'),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('H1'),
        toPosition: positionFromEncodedCoordinates('H4'),
      })
    ).toBe(false);
  });

  test('black pieces cannot move on turn one', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('F7'),
        toPosition: positionFromEncodedCoordinates('F6'),
      })
    ).toBe(false);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('G8'),
        toPosition: positionFromEncodedCoordinates('F6'),
      })
    ).toBe(false);
  });

  test('empty squares cannot move', () => {
    const board = new Board();
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('A3'),
        toPosition: positionFromEncodedCoordinates('A4'),
      })
    ).toBe(false);
  });

  test('there are 20 possible first moves', () => {
    const board = new Board();
    expect(board.allLegalMoves()).toHaveLength(20);
  });
});

describe('capturing', () => {
  test('rook can capture within the same rank', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('H1'),
        },
        {
          colour: 'white',
          type: 'rook',
          position: positionFromEncodedCoordinates('C3'),
        },
        {
          colour: 'black',
          type: 'rook',
          position: positionFromEncodedCoordinates('E3'),
        },
      ],
      'white'
    );
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C3'),
        toPosition: positionFromEncodedCoordinates('E3'),
      })
    ).toBe(true);
  });

  test('rook cannot capture when blocked', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('H1'),
        },
        {
          colour: 'white',
          type: 'rook',
          position: positionFromEncodedCoordinates('C3'),
        },
        {
          colour: 'white',
          type: 'bishop',
          position: positionFromEncodedCoordinates('D3'),
        },
        {
          colour: 'black',
          type: 'knight',
          position: positionFromEncodedCoordinates('E3'),
        },
      ],
      'white'
    );
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C3'),
        toPosition: positionFromEncodedCoordinates('E3'),
      })
    ).toBe(false);
  });

  test('pawn can capture on diagonal', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('H1'),
        },
        {
          colour: 'white',
          type: 'pawn',
          position: positionFromEncodedCoordinates('C3'),
        },
        {
          colour: 'white',
          type: 'pawn',
          position: positionFromEncodedCoordinates('D3'),
        },
        {
          colour: 'black',
          type: 'pawn',
          position: positionFromEncodedCoordinates('C4'),
        },
      ],
      'black'
    );

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C4'),
        toPosition: positionFromEncodedCoordinates('D3'),
      })
    ).toBe(true);

    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('C4'),
        toPosition: positionFromEncodedCoordinates('C3'),
      })
    ).toBe(false);
  });
});

describe('detecting check', () => {
  test('black is in check from bishop', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: new Position(0, 0),
        },
        {
          colour: 'black',
          type: 'king',
          position: new Position(0, 7),
        },
        {
          colour: 'white',
          type: 'bishop',
          position: new Position(2, 5),
        },
      ],
      'black'
    );
    expect(board.playerInCheck('black')).toBe(true);
  });

  test('check from bishop blocked by rook', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: new Position(0, 0),
        },
        {
          colour: 'black',
          type: 'king',
          position: new Position(0, 7),
        },
        {
          colour: 'white',
          type: 'bishop',
          position: new Position(2, 5),
        },
        {
          colour: 'black',
          type: 'rook',
          position: new Position(1, 6),
        },
      ],
      'black'
    );
    expect(board.playerInCheck('black')).toBe(false);
  });

  test('white is in check from knight', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: new Position(3, 3),
        },
        {
          colour: 'black',
          type: 'king',
          position: new Position(5, 5),
        },
        {
          colour: 'black',
          type: 'knight',
          position: new Position(2, 1),
        },
      ],
      'white'
    );
    expect(board.playerInCheck('white')).toBe(true);
  });
});

describe('legal moves around check', () => {
  test('king cannot move into check', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: new Position(1, 1),
        },
        {
          colour: 'black',
          type: 'king',
          position: new Position(3, 3),
        },
      ],
      'white'
    );
    expect(
      board.isLegalMove({
        fromPosition: new Position(1, 1),
        toPosition: new Position(2, 2),
      })
    ).toBe(false);
  });

  test('pawn cannot move to reveal check', () => {
    const board = new Board([
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('A1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('B2'),
      },
      {
        colour: 'black',
        type: 'bishop',
        position: positionFromEncodedCoordinates('C3'),
      },
    ]);
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('B3'),
      })
    ).toBe(false);
    // But can capture attacker
    expect(
      board.isLegalMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('C3'),
      })
    ).toBe(true);
  });

  test('black must move out of check', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('F6'),
        },
        {
          colour: 'black',
          type: 'bishop',
          position: positionFromEncodedCoordinates('B2'),
        },
        {
          colour: 'black',
          type: 'bishop',
          position: positionFromEncodedCoordinates('B3'),
        },
        {
          colour: 'white',
          type: 'pawn',
          position: positionFromEncodedCoordinates('F4'),
        },
      ],
      'white'
    );

    const kingMoveFromCheckToCheck: Move = {
      fromPosition: positionFromEncodedCoordinates('A1'),
      toPosition: positionFromEncodedCoordinates('A2'),
    };
    expect(board.isLegalMove(kingMoveFromCheckToCheck)).toBe(false);

    const kingMoveOutOfCheck: Move = {
      fromPosition: positionFromEncodedCoordinates('A1'),
      toPosition: positionFromEncodedCoordinates('B1'),
    };
    expect(board.isLegalMove(kingMoveOutOfCheck)).toBe(true);

    const kingMoveOutOfCheckAndCapture: Move = {
      fromPosition: positionFromEncodedCoordinates('A1'),
      toPosition: positionFromEncodedCoordinates('B2'),
    };
    expect(board.isLegalMove(kingMoveOutOfCheckAndCapture)).toBe(true);

    const pawnMove: Move = {
      fromPosition: positionFromEncodedCoordinates('F4'),
      toPosition: positionFromEncodedCoordinates('F5'),
    };
    expect(board.isLegalMove(pawnMove)).toBe(false);
  });
});

describe('allLegalMoves', () => {
  it('lists all legal moves in a scenario', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('A8'),
        },
        {
          colour: 'white',
          type: 'pawn',
          position: positionFromEncodedCoordinates('A2'),
        },
        {
          colour: 'black',
          type: 'pawn',
          position: positionFromEncodedCoordinates('B3'),
        },
      ],
      'white'
    );
    const legalMoves = board.allLegalMoves();
    const expected: Move[] = [
      {
        fromPosition: positionFromEncodedCoordinates('A1'),
        toPosition: positionFromEncodedCoordinates('B1'),
      },
      {
        fromPosition: positionFromEncodedCoordinates('A1'),
        toPosition: positionFromEncodedCoordinates('B2'),
      },
      {
        fromPosition: positionFromEncodedCoordinates('A2'),
        toPosition: positionFromEncodedCoordinates('A3'),
      },
      {
        fromPosition: positionFromEncodedCoordinates('A2'),
        toPosition: positionFromEncodedCoordinates('A4'),
      },
      {
        fromPosition: positionFromEncodedCoordinates('A2'),
        toPosition: positionFromEncodedCoordinates('B3'),
      },
    ];
    expect(legalMoves).toEqual(expected);
  });

  it('identifies stalemate', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('F8'),
        },
        {
          colour: 'black',
          type: 'queen',
          position: positionFromEncodedCoordinates('B3'),
        },
      ],
      'white'
    );
    expect(board.allLegalMoves()).toHaveLength(0);
    expect(board.isStalemate()).toBe(true);
    expect(board.isCheckmate()).toBe(false);
  });

  it('identifies checkmate', () => {
    const board = new Board(
      [
        {
          colour: 'white',
          type: 'king',
          position: positionFromEncodedCoordinates('C3'),
        },
        {
          colour: 'white',
          type: 'queen',
          position: positionFromEncodedCoordinates('B2'),
        },
        {
          colour: 'black',
          type: 'king',
          position: positionFromEncodedCoordinates('A1'),
        },
      ],
      'black'
    );

    expect(board.allLegalMoves()).toHaveLength(0);
    expect(board.isCheckmate()).toBe(true);
    expect(board.isStalemate()).toBe(false);
  });
});

describe('En passant', () => {
  test('black pawn can capture using en passant', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('A1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('F6'),
      },
      {
        colour: 'black',
        type: 'pawn',
        position: positionFromEncodedCoordinates('B4'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('A4'),
      },
    ];
    const previousMoves: HistoricalMove[] = [
      {
        piece: {
          colour: 'black',
          type: 'pawn',
        },
        fromPosition: positionFromEncodedCoordinates('B5'),
        toPosition: positionFromEncodedCoordinates('B4'),
        capture: false,
      },
      {
        piece: {
          colour: 'white',
          type: 'pawn',
        },
        fromPosition: positionFromEncodedCoordinates('A2'),
        toPosition: positionFromEncodedCoordinates('A4'),
        capture: false,
      },
    ];

    const board = new Board(pieces, 'black', previousMoves);

    const enPassantMove: Move = {
      fromPosition: positionFromEncodedCoordinates('B4'),
      toPosition: positionFromEncodedCoordinates('A3'),
    };

    expect(board.isLegalMove(enPassantMove)).toBe(true);

    const nearbyMoves: Move[] = ['A2', 'A4', 'A5', 'A6'].map((encoded) => ({
      fromPosition: positionFromEncodedCoordinates('B4'),
      toPosition: positionFromEncodedCoordinates(encoded),
    }));
    for (const invalidMove of nearbyMoves) {
      expect(board.isLegalMove(invalidMove)).toBe(false);
    }

    const allMoves = board.allLegalMoves();
    const enPassantMoveInAllLegalMoves = allMoves.find(
      ({ fromPosition, toPosition }) =>
        fromPosition.x === enPassantMove.fromPosition.x &&
        fromPosition.y === enPassantMove.fromPosition.y &&
        toPosition.x === enPassantMove.toPosition.x &&
        toPosition.y === enPassantMove.toPosition.y
    );
    expect(enPassantMoveInAllLegalMoves).toBeDefined();
  });

  test('white pawns can capture using en passant', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('G1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('G8'),
      },
      {
        colour: 'black',
        type: 'pawn',
        position: positionFromEncodedCoordinates('G5'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('F5'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('H5'),
      },
    ];
    const previousMove: HistoricalMove = {
      piece: {
        colour: 'black',
        type: 'pawn',
      },
      fromPosition: positionFromEncodedCoordinates('G7'),
      toPosition: positionFromEncodedCoordinates('G5'),
      capture: false,
    };

    const board = new Board(pieces, 'white', [previousMove]);

    const enPassantFromFFile: Move = {
      fromPosition: positionFromEncodedCoordinates('F5'),
      toPosition: positionFromEncodedCoordinates('G6'),
    };
    expect(board.isLegalMove(enPassantFromFFile)).toBe(true);

    const enPassantFromHFile: Move = {
      fromPosition: positionFromEncodedCoordinates('H5'),
      toPosition: positionFromEncodedCoordinates('G6'),
    };
    expect(board.isLegalMove(enPassantFromHFile)).toBe(true);
  });

  test('pawns cannot capture using en passant in a later move', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('A1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('F6'),
      },
      {
        colour: 'black',
        type: 'pawn',
        position: positionFromEncodedCoordinates('B4'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('A4'),
      },
    ];
    const previousMove: HistoricalMove[] = [
      {
        piece: {
          colour: 'white',
          type: 'king',
        },
        fromPosition: positionFromEncodedCoordinates('B1'),
        toPosition: positionFromEncodedCoordinates('A1'),
        capture: false,
      },
    ];

    const board = new Board(pieces, 'black', previousMove);

    const enPassantMove: Move = {
      fromPosition: positionFromEncodedCoordinates('B4'),
      toPosition: positionFromEncodedCoordinates('A3'),
    };

    expect(board.isLegalMove(enPassantMove)).toBe(false);
  });

  test('white pawn cannot capture, because it would place them in check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('D1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('D6'),
      },
      {
        colour: 'black',
        type: 'pawn',
        position: positionFromEncodedCoordinates('B4'),
      },
      {
        colour: 'white',
        type: 'pawn',
        position: positionFromEncodedCoordinates('C4'),
      },
      {
        colour: 'white',
        type: 'bishop',
        position: positionFromEncodedCoordinates('A3'),
      },
    ];
    const previousMoves: HistoricalMove[] = [
      {
        piece: {
          colour: 'white',
          type: 'pawn',
        },
        fromPosition: positionFromEncodedCoordinates('C2'),
        toPosition: positionFromEncodedCoordinates('C4'),
        capture: false,
      },
    ];

    const board = new Board(pieces, 'black', previousMoves);

    const enPassantMove: Move = {
      fromPosition: positionFromEncodedCoordinates('B4'),
      toPosition: positionFromEncodedCoordinates('C3'),
    };

    expect(board.isLegalMove(enPassantMove)).toBe(false);
  });
});

describe('Castling', () => {
  test('can castle king-side', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('G1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(true);

    const allMoves = board.allLegalMoves();
    const castlingMoveInAllLegalMoves = allMoves.find(
      ({ fromPosition, toPosition }) =>
        fromPosition.x === castlingMove.fromPosition.x &&
        fromPosition.y === castlingMove.fromPosition.y &&
        toPosition.x === castlingMove.toPosition.x &&
        toPosition.y === castlingMove.toPosition.y
    );
    expect(castlingMoveInAllLegalMoves).toBeDefined();
  });

  test('can castle queen-side', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('A1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('C1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(true);
  });

  test('black can castle', () => {
    const pieces: Piece[] = [
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
      {
        colour: 'black',
        type: 'rook',
        position: positionFromEncodedCoordinates('A8'),
      },
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
    ];
    const board = new Board(pieces, 'black');

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E8'),
      toPosition: positionFromEncodedCoordinates('C8'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(true);
  });

  test('cannot castle when obstructed', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('A1'),
      },
      {
        colour: 'white',
        type: 'knight',
        position: positionFromEncodedCoordinates('B1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('C1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });

  test('cannot castle out of check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
      {
        colour: 'black',
        type: 'rook',
        position: positionFromEncodedCoordinates('E7'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('G1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });

  test('white cannot castle through check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
      {
        colour: 'black',
        type: 'rook',
        position: positionFromEncodedCoordinates('F7'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('G1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });

  test('cannot castle into check', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
      {
        colour: 'black',
        type: 'rook',
        position: positionFromEncodedCoordinates('G7'),
      },
    ];
    const board = new Board(pieces, 'white', []);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('G1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });

  test('cannot castle having already moved king', () => {
    const pieces: Piece[] = [
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
      {
        colour: 'black',
        type: 'rook',
        position: positionFromEncodedCoordinates('A8'),
      },
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
    ];
    const previousMoves: HistoricalMove[] = [
      {
        piece: {
          colour: 'black',
          type: 'king',
        },
        fromPosition: positionFromEncodedCoordinates('D8'),
        toPosition: positionFromEncodedCoordinates('E8'),
        capture: false,
      },
      {
        piece: {
          colour: 'white',
          type: 'king',
        },
        fromPosition: positionFromEncodedCoordinates('D1'),
        toPosition: positionFromEncodedCoordinates('E1'),
        capture: false,
      },
    ];
    const board = new Board(pieces, 'black', previousMoves);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E8'),
      toPosition: positionFromEncodedCoordinates('C8'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });

  test('white cannot castle having already moved rook', () => {
    const pieces: Piece[] = [
      {
        colour: 'white',
        type: 'king',
        position: positionFromEncodedCoordinates('E1'),
      },
      {
        colour: 'white',
        type: 'rook',
        position: positionFromEncodedCoordinates('H1'),
      },
      {
        colour: 'black',
        type: 'king',
        position: positionFromEncodedCoordinates('E8'),
      },
    ];
    const previousMoves: HistoricalMove[] = [
      {
        piece: {
          colour: 'white',
          type: 'rook',
        },
        fromPosition: positionFromEncodedCoordinates('G1'),
        toPosition: positionFromEncodedCoordinates('H1'),
        capture: true,
      },
      {
        piece: {
          colour: 'black',
          type: 'king',
        },
        fromPosition: positionFromEncodedCoordinates('D8'),
        toPosition: positionFromEncodedCoordinates('E8'),
        capture: false,
      },
    ];
    const board = new Board(pieces, 'white', previousMoves);

    const castlingMove: Move = {
      fromPosition: positionFromEncodedCoordinates('E1'),
      toPosition: positionFromEncodedCoordinates('G1'),
    };

    expect(board.isLegalMove(castlingMove)).toBe(false);
  });
});

describe('makeMove', () => {
  test('basic move', () => {
    const a2 = positionFromEncodedCoordinates('A2');
    const a4 = positionFromEncodedCoordinates('A4');

    const board = new Board();

    const boardAfterMove = board.makeMove({
      fromPosition: a2,
      toPosition: a4,
    });

    expect(boardAfterMove.pieceAtPosition(a4)?.type).toBe('pawn');
    expect(boardAfterMove.pieceAtPosition(a2)).toBeUndefined();
    expect(boardAfterMove.pastMoves).toEqual([
      { piece: { colour: 'white', type: 'pawn' }, capture: false, fromPosition: a2, toPosition: a4 },
    ]);
  });

  test('capture', () => {
    const b1 = positionFromEncodedCoordinates('B1');
    const b4 = positionFromEncodedCoordinates('B4');

    const board = new Board([
      { colour: 'white', position: b4, type: 'rook' },
      { colour: 'black', position: b1, type: 'knight' },
      { colour: 'white', position: positionFromEncodedCoordinates('f7'), type: 'king' },
      { colour: 'black', position: positionFromEncodedCoordinates('d3'), type: 'king' },
    ]);

    const boardAfterMove = board.makeMove({
      fromPosition: b4,
      toPosition: b1,
    });

    expect(boardAfterMove.pieceAtPosition(b1)).toEqual({ colour: 'white', type: 'rook', position: b1 });
    expect(boardAfterMove.pieceAtPosition(b4)).toBeUndefined();

    const expectedPreviousMove: HistoricalMove = {
      fromPosition: b4,
      toPosition: b1,
      capture: true,
      piece: {
        colour: 'white',
        type: 'rook',
      },
    };
    expect(boardAfterMove.previousMove).toEqual(expectedPreviousMove);
  });

  test('invalid move', () => {
    const board = new Board();

    const move = () =>
      board.makeMove({
        fromPosition: positionFromEncodedCoordinates('B2'),
        toPosition: positionFromEncodedCoordinates('F7'),
      });

    expect(move).toThrow();
  });

  test('does not mutate original board', () => {
    const board = new Board();
    board.makeMove({
      fromPosition: positionFromEncodedCoordinates('D2'),
      toPosition: positionFromEncodedCoordinates('D4'),
    });

    expect(board).toEqual(new Board());
  });

  test('en passant', () => {
    const g7 = positionFromEncodedCoordinates('g7');
    const g6 = positionFromEncodedCoordinates('g6');
    const g5 = positionFromEncodedCoordinates('g5');
    const f5 = positionFromEncodedCoordinates('f5');

    const board = new Board(
      [
        { colour: 'white', position: positionFromEncodedCoordinates('a1'), type: 'king' },
        { colour: 'black', position: positionFromEncodedCoordinates('h1'), type: 'king' },
        { colour: 'white', position: f5, type: 'pawn' },
        { colour: 'black', position: g7, type: 'pawn' },
      ],
      'black'
    );

    const boardAfterSetupMove = board.makeMove({
      fromPosition: g7,
      toPosition: g5,
    });

    expect(boardAfterSetupMove.pieceAtPosition(g7)).toBeUndefined();
    expect(boardAfterSetupMove.pieceAtPosition(g5)).toEqual({ colour: 'black', type: 'pawn', position: g5 });

    const boardAfterEnPassant = boardAfterSetupMove.makeMove({
      fromPosition: f5,
      toPosition: g6,
    });

    expect(boardAfterEnPassant.pieceAtPosition(g5)).toBeUndefined();
    expect(boardAfterEnPassant.pieceAtPosition(g6)).toEqual({ colour: 'white', type: 'pawn', position: g6 });

    const expectedPreviousMove: HistoricalMove = {
      fromPosition: f5,
      toPosition: g6,
      capture: true,
      piece: {
        colour: 'white',
        type: 'pawn',
      },
      specialMove: {
        enPassant: true,
      },
    };
    expect(boardAfterEnPassant.previousMove).toEqual(expectedPreviousMove);

    expect(boardAfterEnPassant.pastMoves).toHaveLength(2);
  });

  test('castling king-side', () => {
    const e1 = positionFromEncodedCoordinates('e1');
    const f1 = positionFromEncodedCoordinates('f1');
    const g1 = positionFromEncodedCoordinates('g1');
    const h1 = positionFromEncodedCoordinates('h1');

    const board = new Board([
      { colour: 'white', type: 'king', position: e1 },
      { colour: 'white', type: 'rook', position: h1 },
      { colour: 'black', type: 'king', position: positionFromEncodedCoordinates('F7') },
    ]);

    const boardAfterMove = board.makeMove({ fromPosition: e1, toPosition: g1 });

    expect(boardAfterMove.pieceAtPosition(e1)).toBeUndefined();
    expect(boardAfterMove.pieceAtPosition(f1)).toEqual({ colour: 'white', type: 'rook', position: f1 });
    expect(boardAfterMove.pieceAtPosition(g1)).toEqual({ colour: 'white', type: 'king', position: g1 });
    expect(boardAfterMove.pieceAtPosition(h1)).toBeUndefined();

    const expectedPreviousMove: HistoricalMove = {
      fromPosition: e1,
      toPosition: g1,
      capture: false,
      piece: {
        colour: 'white',
        type: 'king',
      },
      specialMove: {
        castling: 'king-side',
      },
    };

    expect(boardAfterMove.previousMove).toEqual(expectedPreviousMove);
  });

  test('castling queen-side', () => {
    const a1 = positionFromEncodedCoordinates('a1');
    const c1 = positionFromEncodedCoordinates('c1');
    const d1 = positionFromEncodedCoordinates('d1');
    const e1 = positionFromEncodedCoordinates('e1');

    const board = new Board([
      { colour: 'white', type: 'king', position: e1 },
      { colour: 'white', type: 'rook', position: a1 },
      { colour: 'black', type: 'king', position: positionFromEncodedCoordinates('F7') },
    ]);

    const boardAfterMove = board.makeMove({ fromPosition: e1, toPosition: c1 });

    expect(boardAfterMove.pieceAtPosition(a1)).toBeUndefined();
    expect(boardAfterMove.pieceAtPosition(c1)).toEqual({ colour: 'white', type: 'king', position: c1 });
    expect(boardAfterMove.pieceAtPosition(d1)).toEqual({ colour: 'white', type: 'rook', position: d1 });
    expect(boardAfterMove.pieceAtPosition(e1)).toBeUndefined();

    const expectedPreviousMove: HistoricalMove = {
      fromPosition: e1,
      toPosition: c1,
      capture: false,
      piece: {
        colour: 'white',
        type: 'king',
      },
      specialMove: {
        castling: 'queen-side',
      },
    };

    expect(boardAfterMove.previousMove).toEqual(expectedPreviousMove);
  });

  test('promotion', () => {
    const e7 = positionFromEncodedCoordinates('E7');
    const e8 = positionFromEncodedCoordinates('E8');

    const board = new Board([
      { colour: 'white', position: positionFromEncodedCoordinates('a1'), type: 'king' },
      { colour: 'black', position: positionFromEncodedCoordinates('h1'), type: 'king' },
      { colour: 'white', position: e7, type: 'pawn' },
    ]);

    const move = { fromPosition: e7, toPosition: e8 };

    expect(board.moveIsPromotion(move)).toBe(true);

    const boardAfterMove = board.makeMove(move, 'bishop');

    expect(boardAfterMove.pieceAtPosition(e8)).toEqual({ colour: 'white', type: 'bishop', position: e8 });

    const expectedPreviousMove: HistoricalMove = {
      fromPosition: e7,
      toPosition: e8,
      capture: false,
      piece: {
        colour: 'white',
        type: 'pawn',
      },
      specialMove: {
        promotion: 'bishop',
      },
    };
    expect(boardAfterMove.previousMove).toEqual(expectedPreviousMove);
  });

  test('promotion with invalid input', () => {
    const e7 = positionFromEncodedCoordinates('E7');

    const board = new Board([
      { colour: 'white', position: positionFromEncodedCoordinates('a1'), type: 'king' },
      { colour: 'black', position: positionFromEncodedCoordinates('h1'), type: 'king' },
      { colour: 'white', position: e7, type: 'pawn' },
    ]);

    const move = { fromPosition: e7, toPosition: positionFromEncodedCoordinates('e8') };

    expect(board.moveIsPromotion(move)).toBe(true);

    expect(() => board.makeMove(move)).toThrow();
  });

  test('non-promotion with invalid input', () => {
    const board = new Board();

    const move = {
      fromPosition: positionFromEncodedCoordinates('b2'),
      toPosition: positionFromEncodedCoordinates('b3'),
    };

    expect(board.moveIsPromotion(move)).toBe(false);

    expect(() => board.makeMove(move, 'knight')).toThrow();
  });

  // TODO: checkmate and stalemate
});
