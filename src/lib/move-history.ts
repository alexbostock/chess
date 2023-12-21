import { HistoricalMove, PieceType } from './Board';

export function pairedMoves(moves: string[]): [string, string | undefined][] {
  const pairs: [string, string | undefined][] = [];

  for (let i = 0; i < moves.length; i += 2) {
    if (i + 1 < moves.length) {
      pairs.push([moves[i], moves[i + 1]]);
    } else {
      pairs.push([moves[i], undefined]);
    }
  }

  return pairs;
}

export function moveToNotation(move: HistoricalMove): string {
  // TODO: handle disambiguation with historical board state for context

  const destination = move.toPosition.encodedCoordinate.toLowerCase();

  const attackOnKing = attackOnKingToNotation(move.attackOnKing);

  if (move.specialMove && 'castling' in move.specialMove) {
    const notation = move.specialMove.castling === 'king-side' ? '0-0' : '0-0-0';
    return notation + attackOnKing;
  }
  return `${pieceTypeToNotation(move.piece.type)}${captureNotation(move)}${destination}${promotionNotation(
    move
  )}${attackOnKing}`;
}

function pieceTypeToNotation(type: PieceType): string {
  switch (type) {
    case 'bishop':
      return 'B';
    case 'king':
      return 'K';
    case 'knight':
      return 'N';
    case 'pawn':
      return '';
    case 'queen':
      return 'Q';
    case 'rook':
      return 'R';
  }
}

function attackOnKingToNotation(attack: HistoricalMove['attackOnKing']): string {
  switch (attack) {
    case 'check':
      return '+';
    case 'checkmate':
      return '#';
    default:
      return '';
  }
}

function captureNotation(move: HistoricalMove): string {
  if (!move.capture) {
    return '';
  }
  if (move.piece.type === 'pawn') {
    return move.fromPosition.encodedCoordinate.slice(0, 1).toLowerCase() + 'x';
  } else {
    return 'x';
  }
}

function promotionNotation(move: HistoricalMove): string {
  if (move.specialMove && 'promotion' in move.specialMove && move.specialMove.promotion) {
    return '=' + pieceTypeToNotation(move.specialMove.promotion);
  } else {
    return '';
  }
}
