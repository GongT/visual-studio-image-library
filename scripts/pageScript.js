'use strict';

let view = listOfIcons;
let pageMax;
let page = 1;
const perPage = Math.min(Math.floor(window.innerWidth / (72 + 10)), 23) * 4;
const blocksContainer = document.getElementById('blocksContainer');

function update() {
	pageMax = Math.ceil(view.length / perPage);
}

const setters = (new Array(perPage)).fill('1').map(() => {
	const div = document.createElement('DIV');
	div.classList.add('icon-block');

	const icon = document.createElement('SPAN');
	icon.classList.add('vs-icons');

	const title = document.createElement('SPAN');
	title.classList.add('title');

	div.append(icon, title);
	blocksContainer.append(div);

	return (name) => {
		icon.className = `vs-icons ${name}`;
		title.innerText = name;
	};
});

function search() {
	const mstr = document.getElementById('searchInput').value;
	view = listOfIcons.filter(icon => icon.toLowerCase().includes(mstr.toLowerCase()));
	update();
	page = 1;
	show();
}

function searchRegex() {
	const regstr = document.getElementById('searchInput').value;
	const regExp = new RegExp(regstr, 'i');
	view = listOfIcons.filter(icon => regExp.test(icon));
	update();
	page = 1;
	show();
}

const $pageIn = document.getElementById('pageNumber');
const $pageCnt = document.getElementById('pageCount');

$pageIn.addEventListener('keypress', (e) => {
	if (e.code === 'Enter' || e.code === 'NumpadEnter') {
		page = parseInt($pageIn.value.trim());
		show();
	}
});

function show(pageOp) {
	if (pageOp) {
		page += pageOp;
	}
	if (page < 1) {
		page = 1;
	}
	if (page > pageMax) {
		page = pageMax;
	}

	$pageIn.value = `${page}`;
	$pageCnt.innerText = `/${pageMax}`;
	const start = (page - 1) * perPage;
	for (let index = 0; index < perPage; index++) {
		const name = view[start + index];
		if (name) {
			setters[index](name);
		} else {
			setters[index]('');
		}
	}
}

let bgBlack = false;

const $body = document.querySelector('body');

function colorSwitch(btn) {
	bgBlack = !bgBlack;
	if (bgBlack) {
		$body.classList.add('black', 'vs-icons-inverse-theme');
		$body.classList.remove('white');
		btn.style.background = 'white';
		btn.classList.remove('lightbulb');
		btn.classList.add('lightSwitch');
	} else {
		$body.classList.remove('black', 'vs-icons-inverse-theme');
		$body.classList.add('white');
		btn.classList.remove('lightSwitch');
		btn.classList.add('lightbulb');
	}
}

update();
show();
