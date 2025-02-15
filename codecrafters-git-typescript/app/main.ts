// want to implement git cat-file commmand

// import * as fs from "fs";
// import zlib from "zlib";

// console.log(process.argv);
// const args = process.argv.slice(2);
// console.log("args  " + args);

// const commmand = args[0];

// enum Comamands {
// 	CatFile = "cat-file",
// 	Init = "init",
// }

// const catFile = (hash: string) => {
// 	const folder = ".git/objects/" + hash.substring(0, 2);
// 	const file = hash.substring(2);
// 	const zlibData = fs.readFileSync(`${folder}/${file}`);
// 	const data = zlib.inflateSync(zlibData).toString();
// 	console.log(data);
// };

// const init = () => {
// 	if (!fs.existsSync(".git")) {
// 		fs.mkdirSync(".git");
// 		fs.mkdirSync(".git/objects");
// 		console.log("Initialized git repo");
// 	} else {
// 		console.log("Already a git repository");
// 	}
// };

// switch (commmand) {
// 	case Comamands.CatFile:
// 		catFile(args[1]);
// 		break;
// 	case Comamands.Init:
// 		init();
// 		break;
// 	default:
// 		console.log("Unknown command");
// }

import * as fs from "fs";
import zlib from "zlib";
const args = process.argv.slice(2);
const command = args[0];
enum Commands {
	Init = "init",
	Catfile = "cat-file",
}
switch (command) {
	case Commands.Init:
		fs.mkdirSync(".git", { recursive: true });
		fs.mkdirSync(".git/objects", { recursive: true });
		fs.mkdirSync(".git/refs", { recursive: true });
		fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
		console.log("Initialized git directory");
		break;
	case Commands.Catfile:
		const blobDir = args[2].substring(0, 2);
		const blobFile = args[2].substring(2);
		const blob = fs.readFileSync(`.git/objects/${blobDir}/${blobFile}`);
		const decompressedBuffer = zlib.unzipSync(blob);
		const nullByteIndex = decompressedBuffer.indexOf(0);
		const blobContent = decompressedBuffer
			.subarray(nullByteIndex + 1)
			.toString();
		process.stdout.write(blobContent);
		break;
	default:
		throw new Error(`Unknown command ${command}`);
}
