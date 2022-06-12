import fs from "node:fs";
import path from "node:path";

function writeFile(filename, data, options) {

	let promise = new Promise((resolve, reject) => {

		if (typeof options === "undefined") options = {}

		fs.stat(filename, (err) => {
			if (err !== null && err.code === "ENOENT") {

				fs.mkdir(path.dirname(filename), { recursive: true }, (err) => {
					if (err !== null) reject(err);

					fs.writeFile(filename, data, options, (err) => {
						if (err !== null) reject(err);
						resolve();
					});
				});
			} else {
				if (err !== null) reject(err);

				fs.writeFile(filename, data, options, (err) => {
					if (err !== null) reject(err);
					resolve();
				});
			}
		});
	});
	return promise;
}

export default writeFile;
