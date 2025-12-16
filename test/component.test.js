import { expect, it } from "vitest";
import { ComponentArray, ComponentMultiArray } from "src/component.js";

it("component add value", () => {
        const comp = new ComponentArray();
        comp.add(1);
        expect(comp.get(0)).toBe(1);
});

it("component add arr value", () => {
        const comp = new ComponentArray();
        comp.add([]);
        expect(comp.get(0)).toStrictEqual([]);
});

it("component update value", () => {
        const comp = new ComponentArray();
        comp.add(77);
        comp.set(0, 11);
        expect(comp.get(0)).toBe(11);
});

it("component get out of range", () => {
        const comp = new ComponentArray();

        expect(() => comp.get(0)).toThrowError();
});

it("component set out of range", () => {
        const comp = new ComponentArray();

        expect(() => comp.set(0, 1)).toThrowError();
});

it("component remove out of range", () => {
        const comp = new ComponentArray();

        expect(() => comp.remove(0)).toThrowError();
});

it("component remove value", () => {
        const comp = new ComponentArray();

        comp.add(112);
        comp.add(77);

        comp.remove(0);

        expect(comp.get(0)).toEqual(77);
});

it("component removes last value", () => {
        const comp = new ComponentArray();

        comp.add(112);
        comp.add(77);

        comp.remove(1);

        expect(comp.get(0)).toEqual(112);
});

it("ComponentMultiArray adds new components", () => {
        const cmarr = new ComponentMultiArray();
        cmarr.add("x");
        cmarr.add("color");

        expect(cmarr.components.length).toEqual(2);
        expect(cmarr.components).toEqual(
                expect.arrayContaining(["x", "color"]),
        );

        expect(cmarr.lastIndex).toEqual(2);
});

it("ComponentMultiArray removes component", () => {
        const cmarr = new ComponentMultiArray();
        cmarr.add("x");
        cmarr.add("color");

        cmarr.removeComponent("x");

        expect(cmarr.multiarr.length).toEqual(1);

        expect(cmarr.components.length).toEqual(1);
        expect(cmarr.components).not.toContain("x");

        expect(cmarr.lastIndex).toEqual(1);
});
