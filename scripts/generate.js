const { endExample, pushExample } = require('./example');
const glob = require('glob');
const { resolve, basename } = require('path');
const {
	readFileSync, openSync, closeSync, writeSync, writeFileSync, mkdirSync, existsSync, removeSync,
} = require('fs-extra');
const { svgDataUri } = require('./encode');
const { createDoc } = require('./createDoc');

const distBaseDir = resolve(__dirname, '../dist');

const esWriter = openSync(resolve(distBaseDir, 'index.mjs'), 'w');
const dtsWriter = openSync(resolve(distBaseDir, 'index.d.ts'), 'w');
const jsWriter = openSync(resolve(distBaseDir, 'index.js'), 'w');
const cssWriter = openSync(resolve(distBaseDir, 'index.css'), 'w');

writeSync(cssWriter, `.vs-icons:before {
\toutline-offset: 0;
\tdisplay: inline-block;
\tbackground-repeat: no-repeat;
\tbackground-size: contain;
\tcontent: ' ';
\theight: 1em;
\twidth: 1em;
}
`);

const exists = {};

const sepDir = resolve(distBaseDir, 'standalone');
if (existsSync(sepDir)) {
	removeSync(sepDir);
}
mkdirSync(sepDir);

const rets = [];

glob(resolve(__dirname, '../image-library/**/*.svg'), {
	nodir: true,
}, (err, files) => {
	if (err) {
		throw err;
	}
	for (const file of files) {
		rets.push(parse(file));
	}

	writeSync(esWriter, `export const vsiconCount = ${files.length};\n`);
	writeSync(jsWriter, `exports.vsiconCount = ${files.length};
	Object.freeze(exports);
	`);

	closeSync(esWriter);
	closeSync(jsWriter);
	endExample();

	createDoc(rets.map(item => item.fname));
});

const NumberNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function parse(file) {
	let name = basename(file, '.svg');
	name = name.replace(/_\d+x/g, '');
	name = name.replace(/^(\d+)(.)/, (_, num, start) => {
		return NumberNames[num] + start.toUpperCase();
	});
	name = name.replace(/_\d+/, (m0) => {
		return '';
	});
	name = name.replace(/[_ \-][a-zA-Z]/g, (m0) => {
		return m0.slice(1).toUpperCase();
	});

	const baseName = name;
	for (let i = 0; exists[name]; i++, name = baseName + i) {
	}
	exists[name] = true;

	const fname = name.replace(/^[A-Z]+/, (m0) => {
		if (m0.length === 1) {
			return m0.toLowerCase();
		}
		return m0.slice(0, m0.length - 1).toLowerCase() + m0.slice(m0.length - 1);
	});
	const varName = 'vsicon' + name.replace(/^[a-z]/, (m0) => {
		return m0.toUpperCase();
	});

	const content = readFileSync(file, 'utf-8').trim();

	pushExample(fname, content);

	writeSync(dtsWriter, `export const ${varName}: string;\n`);
	writeSync(esWriter, `export {svg as ${varName}} from "./standalone/${fname}/index.mjs"\n`);
	writeSync(jsWriter, `exports.${varName} = require("./standalone/${fname}/index.js").svg;\n`);

	mkdirSync(resolve(sepDir, fname));
	writeFileSync(resolve(sepDir, fname, `index.js`), `exports.svg = ${JSON.stringify(content)};\n`, 'utf8');
	writeFileSync(resolve(sepDir, fname, `index.mjs`), `export const svg = ${JSON.stringify(content)};\n`, 'utf8');
	writeFileSync(resolve(sepDir, fname, `${fname}.svg`), content);
	writeSync(cssWriter, `.vs-icons.${fname}:before {
	background-image: url(./standalone/${fname}/${fname}.svg);
}
`, 'utf8');

	return { fname };
}
