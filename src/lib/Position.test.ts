import Position, {
  findPositionsBetween,
  positionFromEncodedCoordinates,
} from "./Position";

describe("Position", () => {
  it("outputs coordinates in human-readable format", () => {
    const a1 = new Position(0, 0);
    expect(a1.encodedCoordinate).toBe("A1");

    const b3 = new Position(1, 2);
    expect(b3.encodedCoordinate).toBe("B3");

    const f8 = new Position(5, 7);
    expect(f8.encodedCoordinate).toBe("F8");
  });
});

describe("positionFromEncodedCoordinates", () => {
  it("instantiates Position from human readable coordinates", () => {
    const c3 = positionFromEncodedCoordinates("C3");
    expect(c3.encodedCoordinate).toBe("C3");
  });

  it("accepts lower case coordinates", () => {
    const e6 = positionFromEncodedCoordinates("e6");
    expect(e6.encodedCoordinate).toBe("E6");
  });

  it("throws on out-of-bounds input", () => {
    expect(() => positionFromEncodedCoordinates("i1")).toThrow();

    expect(() => positionFromEncodedCoordinates("a0")).toThrow();

    expect(() => positionFromEncodedCoordinates("e9")).toThrow();
  });

  it("throws on invalid input format", () => {
    expect(() => positionFromEncodedCoordinates("")).toThrow();

    expect(() => positionFromEncodedCoordinates("a")).toThrow();

    expect(() => positionFromEncodedCoordinates("1b")).toThrow();

    expect(() => positionFromEncodedCoordinates("a13")).toThrow();
  });
});

describe("findPositionsBetween", () => {
  it("returns no points when both arguments are the same", () => {
    const positions = findPositionsBetween(
      new Position(1, 2),
      new Position(1, 2)
    );
    expect(positions).toEqual([]);
  });

  it("finds positions between two points in the same file", () => {
    const positions = findPositionsBetween(
      new Position(1, 3),
      new Position(1, 7)
    );
    const expected = [
      new Position(1, 4),
      new Position(1, 5),
      new Position(1, 6),
    ];
    expect(positions).toEqual(expected);
  });

  it("finds positions between two points in the same rank", () => {
    const positions = findPositionsBetween(
      new Position(2, 2),
      new Position(4, 2)
    );
    const expected = [new Position(3, 2)];
    expect(positions).toEqual(expected);
  });

  it("finds positions between two points in the same diagonal with +ve gradient", () => {
    const positions = findPositionsBetween(
      new Position(1, 3),
      new Position(3, 5)
    );
    const expected = [new Position(2, 4)];
    expect(positions).toEqual(expected);
  });

  it("finds positions between two points in the same diagonal with -ve gradient", () => {
    const positions = findPositionsBetween(
      new Position(1, 3),
      new Position(3, 1)
    );
    const expected = [new Position(2, 2)];
    expect(positions).toEqual(expected);
  });

  it("throws if the arguments are not on the same rank, file or diagonal", () => {
    expect(() =>
      findPositionsBetween(new Position(1, 3), new Position(3, 4))
    ).toThrow();
  });
});
