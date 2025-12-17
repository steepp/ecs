import { beforeEach, describe, expect, it } from "vitest";
import { ItemContainer, ComponentMultiArray } from "src/component.js";

describe("ItemContainer", () => {
        let comp;

        beforeEach(() => {
                comp = new ItemContainer();
        });

        it("adds value", () => {
                comp.add(1);
                expect(comp.get(0)).toBe(1);
        });

        it("adds Array value", () => {
                comp.add([]);
                expect(comp.get(0)).toStrictEqual([]);
        });

        it("updates value", () => {
                comp.add(77);
                comp.set(0, 11);
                expect(comp.get(0)).toBe(11);
        });

        it("out of range index acces", () => {
                expect(() => comp.get(0)).toThrowError();
        });

        it("modify out of range", () => {
                expect(() => comp.set(0, 1)).toThrowError();
        });

        it("remove out of range", () => {
                expect(() => comp.remove(0)).toThrowError();
        });

        it("removes value", () => {
                comp.add(112);
                comp.add(77);

                comp.remove(0);

                expect(comp.get(0)).toEqual(77);
        });

        it("removes last value", () => {
                comp.add(112);
                comp.add(77);

                comp.remove(1);

                expect(comp.get(0)).toEqual(112);
        });
});

describe("ComponentMultiArray ", () => {
        let cmarr;

        beforeEach(() => {
                cmarr = new ComponentMultiArray();
        });

        it("adds new components", () => {
                cmarr.add("x");
                cmarr.add("color");

                expect(cmarr.components.length).toEqual(2);
                expect(cmarr.components).toEqual(
                        expect.arrayContaining(["x", "color"]),
                );

                expect(cmarr.lastIndex).toEqual(2);
        });

        it("removes component", () => {
                cmarr.add("x");
                cmarr.add("color");

                cmarr.removeComponent("x");

                expect(cmarr.multiarr.length).toEqual(1);

                expect(cmarr.components.length).toEqual(1);
                expect(cmarr.components).not.toContain("x");

                expect(cmarr.lastIndex).toEqual(1);
        });
});
