import Position, { positionFromEncodedCoordinates } from "./Position";

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
