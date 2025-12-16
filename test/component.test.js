import { expect, it } from "vitest";
import { ComponentArray, ComponentMultiArray } from "src/component.js";

it("component add value", () => {
        const comp = new ComponentArray();
        comp.addVal(1);
        expect(comp.getVal(0)).toBe(1);
});

it("component add arr value", () => {
        const comp = new ComponentArray();
        comp.addVal([]);
        expect(comp.getVal(0)).toStrictEqual([]);
});

it("component update value", () => {
        const comp = new ComponentArray();
        comp.addVal(77);
        comp.updateVal(0, 11);
        expect(comp.getVal(0)).toBe(11);
});

it("component remove value", () => {
        const comp = new ComponentArray();

        comp.addVal(112);
        comp.addVal(77);

        comp.removeVal(0);

        expect(comp.getVal(0)).toEqual(77);
});

it("ComponentMultiArray adds new component", () => {
        const cmarr = new ComponentMultiArray();
        cmarr.add("x");

        expect(cmarr.components.length).toEqual(1);
        expect(cmarr.components[0]).toEqual("x");
});
