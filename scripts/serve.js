const { resolve } = require('path');

const root = resolve(__dirname, '../');

const app = require('express')();

app.use((req, res, next) => {
	console.log('%s - %s', req.method, req.url);
	next();
});

app.get('/', (req, res) => {
	res.sendFile(resolve(root, 'index.html'));
});
app.get('/scripts/pageScript.js', (req, res) => {
	res.sendFile(resolve(root, 'scripts/pageScript.js'), { headers: { 'content-type': 'text/javascript' } });
});
app.get('/dist/index.css', (req, res) => {
	res.sendFile(resolve(root, 'dist/index.css'), { headers: { 'content-type': 'text/css' } });
});
app.get('/dist/standalone/*', (req, res) => {
	res.sendFile(resolve(root, req.url.slice(1)), { headers: { 'content-type': 'image/svg+xml' } });
});

app.listen(23456, () => {
	console.log('listen on port 23456');
});

