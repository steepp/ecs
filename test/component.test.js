import { expect, it } from "vitest";
import { Component } from "src/component.js";

const comp = new Component();

it("component add value", () => {
        comp.addVal(1);
        expect(comp.getVal(0)).toBe(1);
});

it("component update value", () => {
        comp.updateVal(0, 11);
        expect(comp.getVal(0)).toBe(11);
});

it("component remove value", () => {
        comp.addVal(77);
        comp.removeVal(0);
        expect(comp.getVal(0)).toEqual(77);
});
