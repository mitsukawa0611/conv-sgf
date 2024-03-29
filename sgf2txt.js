// 各種定数
const COLOR_MAPPING = {
	B: '黒',
	W: '白' 
};
const GAME_MAPPING = {
	EV: '大会名',
	PC: '対局場所',
	SZ: '碁盤サイズ',
	DT: '対局日',
	PB: '黒',
	PW: '白',
	KM: 'こみ',
	HA: '置き石',
	RE: '結果',
};
const X_MAPPING = {
	a: '1',
	b: '2',
	c: '3',
	d: '4',
	e: '5',
	f: '6',
	g: '7',
	h: '8',
	i: '9',
	j: '10',
	k: '11',
	l: '12',
	m: '13',
	n: '14',
	o: '15',
	p: '16',
	q: '17',
	r: '18',
	s: '19'
};
const Y_MAPPING = {
	a: '一',
	b: '二',
	c: '三',
	d: '四',
	e: '五',
	f: '六',
	g: '七',
	h: '八',
	i: '九',
	j: '十',
	k: '十一',
	l: '十二',
	m: '十三',
	n: '十四',
	o: '十五',
	p: '十六',
	q: '十七',
	r: '十八',
	s: '十九'
};
const PASS_FROM_WORD = 'tt';
const PASS_TO_WORD = 'パス';
const WIN_FROM_WORD = 'R';
const WIN_TO_WORD = '中押し';

// 空白エラー
const BLANK_ERROR_MSG = '入力欄が空白です'
// 不正フォーマットエラー
const INVALID_ERROR_MSG = '不正なフォーマットです'

function main() {
	try {
		sgf2text();
	}
	catch (e) {
		alert(e);
	}
}

function sgf2text() {
	let result = []

	// SGFの内容を取得
	let sgf_text = document.getElementById('main_text').value
	if (sgf_text == '') {
		alert(BLANK_ERROR_MSG);
		return null;
	}

	// 入力テキストをノードごとに分割
	let nodes = sgf_text.split(';');
	if (nodes.length < 3) {
		throw new Error(INVALID_ERROR_MSG);
	}

	// 対局情報
	let game_info = nodes[1].trim();
	let info_text = ''
	for (let k in GAME_MAPPING) {
		info_text = get_game_info(game_info, k);
		if (info_text == '') {
			continue;
		}
		result.push(`${GAME_MAPPING[k]}: ${info_text}`);
	}

	// ヘッダから情報が何も取得できなければAlert
	if (result.length == 0) {
		throw new Error(INVALID_ERROR_MSG);
	}

	// 着手情報一覧
	let moves = nodes.slice(2, nodes.length);
	let cnt = 1;
	for (let i = 0; i < moves.length; i++) {
		result.push(get_move_text(cnt, moves[i].trim()));
		cnt++;
	}

	// 結果チェック
	undefined_check(result);

	// 結果をページに表示
	let result_area = document.getElementById('result');
	result_area.value = result.join('\n');
}

function get_game_info(game_info, label) {
	// SGFヘッダから対局情報を取得
	let pattern = `(?<=${label}\\[)([^\\]]+)`;
	let regexp = new RegExp(pattern);
	let res = game_info.match(regexp);
	if (res == '' || res == null) {
		return '';
	}

	// ヒットした文字列取得
	let info_text = res[0];

	// 結果情報以外はここで終了
	if (label != 'RE') {
		return info_text;
	}

	// 結果情報はさらに別パースが必要
	let color = COLOR_MAPPING[info_text[0]];
	let plus = info_text.slice(2, info_text.length);
	if (plus == WIN_FROM_WORD) {
		plus = WIN_TO_WORD;
	} else {
		plus = `${plus}目`
	}

	return `${color}${plus}勝ち`;
}

function get_move_text(cnt, m) {
	// ノードから着手テキストを取得

	// 石情報取得
	let c = COLOR_MAPPING[m[0]];

	// 座標取得
	let pattern = /(?<=\[)[a-z]*(?=\])/;
	let res = m.match(pattern);
	if (res == null) {
		return '';
	}

	// ヒットした文字列取得
	let info_text = res[0];

	// パスを判定
	if (info_text == '' || info_text == PASS_FROM_WORD) {
		return `${c}${cnt}手目: ${PASS_TO_WORD}`;
	}

	// 座標取得
	let x = X_MAPPING[info_text[0]];
	let y = Y_MAPPING[info_text[1]];

	return `${c}${cnt}手目: ${x}の${y}`;
}

function undefined_check(targets) {
	// 引数の配列のどこかにundefinedが含まれていれば例外発生
	for (let i = 0; i < targets.length; i++) {
		if (targets[i].indexOf('undefined') > -1) {
			throw new Error(INVALID_ERROR_MSG);
		}
	}
}

function copy_result() {
	let result_area = document.getElementById('result');
	navigator.clipboard.writeText(result_area.value);
}
