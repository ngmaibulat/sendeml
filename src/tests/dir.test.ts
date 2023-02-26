import assert from "node:assert";
import test from "node:test";
import { isDir } from "../dir.js";

test("test src dir exists", async () => {
    const res = await isDir("./queue");
    assert.equal(res, true);
});

test("test non-existent dir", async () => {
    const res = await isDir("./Karamba");
    assert.equal(res, false);
});
