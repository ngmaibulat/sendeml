import fs from "fs/promises";

export async function isDir(dirname: string): Promise<boolean> {
    if (!dirname) {
        throw new Error("Invalid Argument");
    }

    try {
        const stats = await fs.stat(dirname);
        return stats.isDirectory();
    } catch (err: any) {
        if (err.code === "ENOENT") {
            return false;
        }
        throw err;
    }
}
