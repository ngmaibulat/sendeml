import fs from "node:fs/promises";
import path from "node:path";

import { moveFile } from "./utils/dir.js";

import { logger } from "./logger.js";

logger.info("Salam!");

logger.error("Exception");
