import { HistoricalMove } from './Board';
import { positionFromEncodedCoordinates } from './Position';
import { moveToNotation } from './move-history';

describe('moveToNotation', () => {
  test('basic pawn move', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('b2'),
      toPosition: positionFromEncodedCoordinates('d2'),
      capture: false,
      piece: {
        colour: 'white',
        type: 'pawn',
      },
    };

    const notation = moveToNotation(move);

    expect(notation).toEqual('d2');
  });

  test('pawn capture', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('e5'),
      toPosition: positionFromEncodedCoordinates('d4'),
      capture: true,
      piece: {
        colour: 'black',
        type: 'pawn',
      },
    };

    expect(moveToNotation(move)).toEqual('exd4');
  });

  test('bishop move with capture', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('b2'),
      toPosition: positionFromEncodedCoordinates('e5'),
      capture: true,
      piece: {
        colour: 'black',
        type: 'bishop',
      },
    };

    expect(moveToNotation(move)).toEqual('Bxe5');
  });

  test('knight move threatening check', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('a1'),
      toPosition: positionFromEncodedCoordinates('c2'),
      capture: false,
      piece: {
        colour: 'black',
        type: 'knight',
      },
      attackOnKing: 'check',
    };

    expect(moveToNotation(move)).toEqual('Nc2+');
  });

  test('castling king-side', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('e1'),
      toPosition: positionFromEncodedCoordinates('g1'),
      capture: false,
      piece: {
        colour: 'white',
        type: 'king',
      },
      specialMove: {
        castling: 'king-side',
      },
    };

    expect(moveToNotation(move)).toEqual('0-0');
  });

  test('castling queen-side threatening check', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('e8'),
      toPosition: positionFromEncodedCoordinates('c8'),
      capture: false,
      piece: {
        colour: 'black',
        type: 'king',
      },
      attackOnKing: 'check',
      specialMove: {
        castling: 'queen-side',
      },
    };

    expect(moveToNotation(move)).toEqual('0-0-0+');
  });

  test('queen capture and checkmate', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('h5'),
      toPosition: positionFromEncodedCoordinates('f7'),
      capture: true,
      piece: {
        colour: 'white',
        type: 'queen',
      },
      attackOnKing: 'checkmate',
      gameEnd: 'white-wins',
    };

    expect(moveToNotation(move)).toEqual('Qxf7#');
  });

  test('promotion to rook and checkmate', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('f7'),
      toPosition: positionFromEncodedCoordinates('f8'),
      capture: false,
      piece: {
        colour: 'white',
        type: 'pawn',
      },
      attackOnKing: 'check',
      specialMove: {
        promotion: 'rook',
      },
    };

    expect(moveToNotation(move)).toEqual('f8=R+');
  });

  test('capture and promotion to queen', () => {
    const move: HistoricalMove = {
      fromPosition: positionFromEncodedCoordinates('f7'),
      toPosition: positionFromEncodedCoordinates('g8'),
      capture: true,
      piece: {
        colour: 'white',
        type: 'pawn',
      },
      specialMove: {
        promotion: 'queen',
      },
    };

    expect(moveToNotation(move)).toEqual('fxg8=Q');
  });
});
