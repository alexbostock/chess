import { useState } from 'react';
import GameStatus from './GameStatus';
import MoveHistory from './MoveHistory';
import BoardState, { type Move } from './lib/Board';
import { Piece } from './lib/Piece';
import Position, { RowOrFileNumber, allRowsOrFiles } from './lib/Position';

export default function Board(props: { board: BoardState; move: (move: Move) => void }) {
  const [currentlySelectedPosition, selectPosition] = useState<Position | undefined>();

  function handleClick(position: Position) {
    if (props.board.isCheckmate() || props.board.isStalemate()) {
      return;
    }

    const piece = props.board.pieceAtPosition(position);
    if (piece && piece.colour === props.board.nextToMove) {
      selectPosition(position);
    } else if (currentlySelectedPosition) {
      const move = { fromPosition: currentlySelectedPosition, toPosition: position };
      if (props.board.isLegalMove(move)) {
        props.move(move);
      }
      selectPosition(undefined);
    }
  }

  function row(board: BoardState, rowNumber: RowOrFileNumber) {
    const cells = [
      label((rowNumber + 1).toString(), 'label-left'),
      ...allRowsOrFiles.map((columnNumber) =>
        cell(board.pieceAtPosition(new Position(columnNumber, rowNumber)), new Position(columnNumber, rowNumber))
      ),
      label((rowNumber + 1).toString(), 'label-right'),
    ];
    return (
      <tr key={`row-${rowNumber}`} className="board-row">
        {cells}
      </tr>
    );
  }

  function cell(piece: Piece | undefined, pos: Position) {
    const classNames =
      pos.encodedCoordinate === currentlySelectedPosition?.encodedCoordinate
        ? ['board-cell', 'board-cell-selected']
        : currentlySelectedPosition &&
          props.board.isLegalMove({ fromPosition: currentlySelectedPosition, toPosition: pos })
        ? ['board-cell', 'board-cell-possible-move']
        : ['board-cell'];
    return (
      <td key={pos.encodedCoordinate} className={classNames.join(' ')} onClick={() => handleClick(pos)}>
        {cellContent(piece)}
      </td>
    );
  }

  const rows = [
    labelRow('labels-top'),
    ...allRowsOrFiles
      .slice()
      .reverse()
      .map((rowNumber) => row(props.board, rowNumber)),
    labelRow('labels-bottom'),
  ];

  return (
    <div className="game-view">
      <div className="game-sidebar">
        <MoveHistory board={props.board} />
      </div>

      <div className="board-container">
        <table className="board">
          <tbody>{rows}</tbody>
        </table>
        <GameStatus board={props.board} />
      </div>
    </div>
  );
}

function labelRow(key: string) {
  const labels = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''].map((text, index) => label(text, index.toString()));
  return (
    <tr key={key} className="board-label-row">
      {labels}
    </tr>
  );
}

function label(labelText: string, key: string) {
  return (
    <td key={key} className="board-label">
      {labelText}
    </td>
  );
}

function cellContent(piece: Piece | undefined) {
  if (!piece) {
    return '';
  }

  if (piece.colour === 'black') {
    switch (piece.type) {
      case 'king':
        return '♔';
      case 'queen':
        return '♕';
      case 'bishop':
        return '♗';
      case 'knight':
        return '♘';
      case 'rook':
        return '♖';
      case 'pawn':
        return '♙';
    }
  } else {
    switch (piece.type) {
      case 'king':
        return '♚';
      case 'queen':
        return '♛';
      case 'bishop':
        return '♝';
      case 'knight':
        return '♞';
      case 'rook':
        return '♜';
      case 'pawn':
        return '♟';
    }
  }
}
