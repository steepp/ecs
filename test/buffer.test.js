import { SnapshotBuffer } from "src/game.js";
import { beforeEach, describe, expect, it } from "vitest";

describe("Circular buffer", () => {
        let buffer;

        beforeEach(() => {
                buffer = new SnapshotBuffer(3);
        });

        it("constructor should reject invalid size", () => {
                expect(() => new SnapshotBuffer(0)).toThrow(
                        "Buffer size must be positive integer",
                );
        });

        it("should throw error when reading from empty buffer", () => {
                expect(() => buffer.read()).toThrow("Buffer is empty");
        });

        it("should throw error when full", () => {
                buffer.write(1);
                buffer.write(2);
                buffer.write(3);
                expect(() => buffer.write(4)).toThrow("Buffer is full");
        });

        it("should write and read single item correctly", () => {
                buffer.write(1);
                expect(buffer.read()).toBe(1);
        });

        it("should wrap correctly", () => {
                buffer.write("a");
                buffer.write("b");
                buffer.write("c");

                expect(buffer.read()).toBe("a");

                buffer.write("d");

                expect(buffer.read()).toBe("b");
                expect(buffer.read()).toBe("c");
                expect(buffer.read()).toBe("d");
        });
});
