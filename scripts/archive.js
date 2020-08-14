const fs = require("fs");
const createArchiver = require("archiver");

const cwd = process.cwd();

const writer = fs.createWriteStream(`${cwd}/package.zip`);
const archiver = createArchiver("zip");

archiver.pipe(writer);

archiver.directory(`${cwd}/app/lib`, false);
archiver.directory(`${cwd}/app/node_modules`, "node_modules");

archiver.finalize();
