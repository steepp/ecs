import { beforeEach, describe, expect, it } from "vitest";
import { MultiArray, EntityComponentMultiArray } from "src/component.js";

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
