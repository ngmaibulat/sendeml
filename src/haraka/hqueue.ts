// Haraka Queueu Utils

import fs from "node:fs";
import { HQueueFile, QueueElement } from "./htypes.js";
import { tstampToDate, getTimeDiffSeconds, getTimeDiffHours } from "../utils/time.js";

export function parseFilename(filename: string): QueueElement {
    if (!filename) {
        throw new Error("No filename provided");
    }

    let p = filename.split("_");

    const res: QueueElement = {
        dtArrival: tstampToDate(parseInt(p[0])),
        dtNextAttempt: tstampToDate(parseInt(p[1])),
        attempts: +p[2],
        pid: +p[3],
        uniq: p[4],
        counter: +p[5],
        host: p[6],
        ageSeconds: getTimeDiffSeconds(parseInt(p[0])),
        ageHours: getTimeDiffHours(parseInt(p[0])),
    };

    return res;
}

function readLen(buff: Buffer): number {
    const len = buff.readUInt32BE();
    return len;
}

function readJson(buff: Buffer, len: number): HQueueFile {
    const newbuff = buff.subarray(4, len + 4);
    const strVal = newbuff.toString();
    const obj = JSON.parse(strVal);
    return obj as HQueueFile;
}

function readEml(buff: Buffer, len: number): string {
    const newbuff = buff.subarray(len + 4);
    const strVal = newbuff.toString();
    return strVal;
}

export function readHQueueFile(file: string): HQueueFile {
    const data = fs.readFileSync(file);
    const ln = readLen(data);
    const obj = readJson(data, ln);
    obj.eml = readEml(data, ln);

    obj.dtQueue = new Date();
    obj.dtQueue.setTime(obj.queue_time);

    obj.filename = file;
    obj.fileinfo = parseFilename(file);

    return obj as HQueueFile;
}
