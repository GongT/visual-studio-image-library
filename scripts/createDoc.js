const { writeFileSync, readFileSync } = require('fs-extra');
const { resolve, basename } = require('path');

exports.createDoc = function (list) {
	const html = readFileSync(resolve(__dirname, './index.html'), 'utf-8').replace('__LIST_ICONS_JSON__', JSON.stringify(list));

	writeFileSync(resolve(__dirname, '../index.html'), html);
};
