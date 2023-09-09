export type RowOrFileNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const allRowsOrFiles: RowOrFileNumber[] = [0, 1, 2, 3, 4, 5, 6, 7];

export function isValidRowOrFileNumber(num: number): num is RowOrFileNumber {
  return allRowsOrFiles.some((x) => x === num);
}

const fileMapping: Record<string, RowOrFileNumber> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
};

const rowMapping: Record<string, RowOrFileNumber> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
};

export default class Position {
  readonly x: RowOrFileNumber;
  readonly y: RowOrFileNumber;

  constructor(x: RowOrFileNumber, y: RowOrFileNumber) {
    this.x = x;
    this.y = y;
  }

  get encodedCoordinate(): string {
    const file = Object.entries(fileMapping).find(
      ([_, index]) => index === this.x
    );
    const row = Object.entries(rowMapping).find(
      ([_, index]) => index === this.y
    );
    if (file === undefined || row === undefined) {
      throw new Error("Unexpected internal error");
    }
    return `${file[0]}${row[0]}`;
  }
}

export function positionFromEncodedCoordinates(
  encodedCoordinates: string
): Position {
  const coordinateComponents = encodedCoordinates.split("");
  if (coordinateComponents.length !== 2) {
    throw new Error(`Invalid coordinates: ${encodedCoordinates}`);
  }
  const [file, row] = coordinateComponents;
  const fileNumber: RowOrFileNumber | undefined =
    fileMapping[file.toUpperCase()];
  const rowNumber: RowOrFileNumber | undefined = rowMapping[row];
  if (fileNumber === undefined || rowNumber === undefined) {
    throw new Error(`Invalid coordinates: ${encodedCoordinates}`);
  }
  return new Position(fileNumber, rowNumber);
}

export const allValidPositions: readonly Position[] = allRowsOrFiles
  .map((file) => allRowsOrFiles.map((row) => new Position(file, row)))
  .reduce((allPositions, filePositions) => [...allPositions, ...filePositions]);

export function findPositionsBetween(p1: Position, p2: Position): Position[] {
  if (p1.x === p2.x) {
    const maxY = Math.max(p1.y, p2.y);
    const minY = Math.min(p1.y, p2.y);
    return allValidPositions.filter(
      ({ x, y }) => x === p1.x && minY < y && y < maxY
    );
  } else if (p1.y === p2.y) {
    const maxX = Math.max(p1.x, p2.x);
    const minX = Math.min(p1.x, p2.x);
    return allValidPositions.filter(
      ({ x, y }) => y === p1.y && minX < x && x < maxX
    );
  } else if (Math.abs(p1.x - p2.x) === Math.abs(p1.y - p2.y)) {
    const maxX = Math.max(p1.x, p2.x);
    const minX = Math.min(p1.x, p2.x);
    const maxY = Math.max(p1.y, p2.y);
    const minY = Math.min(p1.y, p2.y);
    return allValidPositions.filter(
      ({ x, y }) =>
        minX < x &&
        x < maxX &&
        minY < y &&
        y < maxY &&
        Math.abs(p1.x - x) === Math.abs(p1.y - y)
    );
  } else {
    throw Error("No path between these points");
  }
}
