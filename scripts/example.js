const {svgDataUri} = require('./encode');
const {resolve} = require('path');
const {openSync, closeSync, writeSync} = require('fs');

const ROW = ['\t<div class="row">\n', '\t</div>\n'];
const ITEM = ['\t\t<div class="col">', '</div>\n'];

const example = openSync(resolve(__dirname, '../index.html'), 'w');

function w(html) {
	writeSync(example, html);
}

w(`<!DOCTYPE html>
<html>
<head>
	<title>VisualStudio Image Library</title>
	<style type="text/css">
		body {display:flex;flex-direction:column;}
		.row {display:flex;flex-direction:row;}
		.col {display:flex;flex:1;flex-direction:column;border:1px solid black;}
		svg, img {width: 32px;height:32px;}
	</style>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.plugins.min.js"></script>
</head>
<body>
`);

let inRow = false;
let currentLineCount = 0;

module.exports.pushExample = function push(title, svg) {
	if (currentLineCount < 6) {
		currentLineCount++;
	} else {
		currentLineCount = 0;
		w(ROW[1]);
		inRow = false;
	}
	if (!inRow) {
		w(ROW[0]);
		inRow = true;
	}
	w(`${ITEM[0]}
			<div>${title}</div>
			<img class="lazy" data-src="${svgDataUri(svg)}" alt="">
		${ITEM[1]}`);
};

module.exports.endExample = function end() {
	if (inRow) {
		w(ROW[1]);
		inRow = false;
	}
	w(`
<script type="text/javascript">
    $('.lazy').Lazy({
        // your configuration goes here
        scrollDirection: 'vertical',
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
</script>
</body>
</html>`);
	
	closeSync(example);
};