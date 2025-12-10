import { expect, test, it, assert } from "vitest";
import { Component } from "src/game.js";

const idx = 0;
const val = 11;

const comp = new Component();

it("updates component value", () => {
        comp.updateVal(idx, val);

        assert.equal(comp.getVal(idx), val);
});
