import assert from "node:assert";
import test from "node:test";
import { isDir } from "../dir.js";

try {
    await isDir("");
} catch (err: any) {
    console.log(errorToObject(err));
}

function errorToObject(err: Error) {
    const tmp = JSON.stringify(err, Object.getOwnPropertyNames(err));
    return JSON.parse(tmp);
}

async function divide() {
    throw new Error("Division by zero");
}

assert.rejects(divide, {
    name: "Error",
    message: "Division by zero",
});
