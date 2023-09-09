type RowOrFileNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export const allRowsOrFiles: RowOrFileNumber[] = [0, 1, 2, 3, 4, 5, 6, 7]

const fileMapping: Record<string, RowOrFileNumber> = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5,
    'G': 6,
    'H': 7,
};

const rowMapping: Record<string, RowOrFileNumber> = {
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
}

export default class Position {
    readonly x: RowOrFileNumber
    readonly y: RowOrFileNumber

    constructor(x: RowOrFileNumber, y: RowOrFileNumber) {
        this.x = x
        this.y = y
    }

    get encodedCoordinate(): string {
        const file = Object.entries(fileMapping).find(([_, index]) => index === this.x)
        const row = Object.entries(rowMapping).find(([_, index]) => index === this.y)
        if (file === undefined || row === undefined) {
            throw new Error('Unexpected internal error')
        }
        return `${file[0]}${row[0]}`
    }
}

export function positionFromEncodedCoordinates(encodedCoordinates: string): Position {
    const coordinateComponents = encodedCoordinates.split('')
    if (coordinateComponents.length !== 2) {
        throw new Error(`Invalid coordinates: ${encodedCoordinates}`)
    }
    const [file, row] = coordinateComponents;
    const fileNumber: RowOrFileNumber | undefined = fileMapping[file.toUpperCase()]
    const rowNumber: RowOrFileNumber | undefined = rowMapping[row]
    if (fileNumber === undefined || rowNumber === undefined) {
        throw new Error(`Invalid coordinates: ${encodedCoordinates}`)
    }
    return new Position(fileNumber, rowNumber)
}