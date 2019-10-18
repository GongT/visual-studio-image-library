module.exports.base64 = base64;

function base64(s) {
	return Buffer.from(s).toString('base64');
}

module.exports.svgDataUri = function (s) {
	return `data:image/svg+xml;base64,${base64(s)}`;
};
