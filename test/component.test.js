import { beforeEach, describe, expect, it } from "vitest";
import {
        ComponentContainer,
        MultiArray,
        EntityComponentMultiArray,
} from "src/component.js";

describe("ItemContainer", () => {
        let comp;

        beforeEach(() => {
                comp = new ComponentContainer();
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

describe("Multi-Array ", () => {
        let cmarr;

        beforeEach(() => {
                cmarr = new MultiArray();
        });

        it("adds new row", () => {
                cmarr.addRow();

                expect(cmarr.multiarr.length).toEqual(1);
                expect(cmarr.multiarr).toEqual(expect.arrayContaining([[]]));
        });

        it("remove row", () => {
                cmarr.addRow();

                cmarr.deleteRow(0);

                expect(cmarr.multiarr.length).toEqual(0);
        });
});

describe("EntityComponentMultiArray", () => {
        let cmarr;

        beforeEach(() => {
                cmarr = new EntityComponentMultiArray();
        });

        it("adds new row", () => {
                cmarr.addComponent("x");
                cmarr.addComponent("color");

                expect(cmarr.multiarr.length).toEqual(2);
                expect(cmarr.multiarr).toEqual(
                        expect.arrayContaining([[], []]),
                );
        });

        it("removes component", () => {
                cmarr.addComponent("x");
                cmarr.addComponent("color");

                cmarr.deleteComponent("x");

                expect(cmarr.multiarr.length).toEqual(1);

                expect(cmarr.multiarr).not.toContain("x");
        });
});
