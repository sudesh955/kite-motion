import path from "path";
import fs from "node:fs/promises";
import sharp from "sharp";

async function findSvg(
	directory: string,
	svgs: string[] = [],
): Promise<string[]> {
	const items = await fs.readdir(directory);
	for (const item of items) {
		const name = path.join(directory, item);
		if (item.endsWith(".svg")) {
			svgs.push(name);
		} else {
			const stat = await fs.stat(name);
			if (stat.isDirectory()) {
				await findSvg(name, svgs);
			}
		}
	}
	return svgs;
}

async function convertToPng(svg: string) {
	const image = sharp(svg);
	const output = await image.toFile(svg.slice(0, -3) + "png");
	let size = output.size;
	for (let i = 2; i <= 3; i++) {
		const image = sharp(svg, {density: 72 * i});
		const output = await image
			.png({compressionLevel: 9})
			.toFile(svg.slice(0, -4) + `@${i}x.png`);
		size += output.size;
	}
	return size;
}

async function main() {
	const root = path.resolve("./src");
	const svgs = await findSvg(root);
	const outputs = await Promise.all(svgs.map((svg) => convertToPng(svg)));
	console.log(outputs.reduce((x, y) => x + y, 0) / (1024 * 1024), "mb");
}

main().catch(console.error);
