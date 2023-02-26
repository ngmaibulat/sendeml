import fs from "fs/promises";

export async function isDir(dirname: string): Promise<boolean> {
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
