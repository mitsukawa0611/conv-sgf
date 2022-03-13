// 各種定数
const COLOR_MAPPING = {
	黒: 'B',
	白: 'W',
};
const GAME_MAPPING = {
	ev: 'EV',
	pc: 'PC',
	dt: 'DT',
	bp: 'PB',
	wp: 'PW',
	komi: 'KM',
	ha: 'HA',
};
const SIZE_TO_WORD = 'SZ';
const RESULT_TO_WORD = 'RE';
const MOVE_MAPPING = {
	1: 'a',
	2: 'b',
	3: 'c',
	4: 'd',
	5: 'e',
	6: 'f',
	7: 'g',
	8: 'h',
	9: 'i',
	10: 'j',
	11: 'k',
	12: 'l',
	13: 'm',
	14: 'n',
	15: 'o',
	16: 'p',
	17: 'q',
	18: 'r',
	19: 's',
};
const PASS_FROM_WORD = 'パス';
const PASS_TO_WORD = 'tt';
const WIN_TO_WORD = 'R';

// 空白エラー
const BLANK_ERROR_MSG = '着手情報が空白です'
// 不正フォーマットエラー
const INVALID_ERROR_MSG = '不正なフォーマットです'
// データ区切り文字
const DATA_DELIMITER = ','

function main() {
	try {
		text2sgf();
	}
	catch (e) {
		if (e.stack) {
			console.log(e.stack);
			alert(e.stack);
		} else {
			// stackがない場合には、そのままエラー情報を出す。
			alert(e.message);
		}
	}
}

function text2sgf() {
	let result = []

	// 対局情報
	let info_text = ''

	// サイズ取得
	info_text += get_size();

	// 結果取得
	info_text += get_result();

	// その他の任意項目
	for (let k in GAME_MAPPING) {
		info_text += get_info(k);
	}

	// 対局情報記録
	result.push(info_text)

	// 着手情報を取得
	let target_text = document.getElementById('main_text').value
	if (target_text == '') {
		alert(BLANK_ERROR_MSG);
		return null;
	}

	// 入力テキストを1手ごとに分割
	let moves = target_text.split(/\r\n|\n/);

	// 初手取得
	let fc = document.getElementsByName('first-color');
	let cnt = 0;
	for (let i = 0; i < fc.length; i++) {
		if (fc[i].checked) {
			cnt = i;
			break;
		}
	}

	for (let i = 0; i < moves.length; i++) {
		result.push(get_move_text(cnt, moves[i]));
		cnt++;
	}

	// 結果チェック
	undefined_check(result);

	// 結果をページに表示
	let result_area = document.getElementById('result');
	result_area.value = `(;${result.join(';')})`;
}

function get_size() {
	// 碁盤サイズ情報取得
	let sz = document.getElementById('size');
	let num = sz.selectedIndex;

	// 数値からvalueを取得
	let result_size = sz.options[num].value;

	return `${SIZE_TO_WORD}[${result_size}]`;
}

function get_result() {
	// 対局結果取得

	// 勝利色判定
	let wc = document.getElementsByName('win-color');
	let win_color = '';
	for (let i = 0; i < wc.length; i++) {
		if (wc[i].checked) {
			win_color = COLOR_MAPPING[wc[i].value];
			break;
		}
	}

	// 中押し勝ちをチェック
	let chk = document.getElementById('中押し');
	if (chk.checked) {
		return `${RESULT_TO_WORD}[${win_color}+${WIN_TO_WORD}]`;
	}

	// 目数を取得
	let win_num = document.getElementById('re').value;

	return `${RESULT_TO_WORD}[${win_color}+${win_num}]`;
}

function get_info(target_id) {
	// 対局情報取得
	let txt = document.getElementById(target_id).value
	if (txt != '') {
		return `${GAME_MAPPING[target_id]}[${txt}]`;
	} else {
		return '';
	}
}

function get_move_text(cnt, m) {
	// 着手テキストを取得

	// 色判定
	let c = ''
	if (cnt % 2 === 0) {
		c = COLOR_MAPPING['黒'];
	} else {
		c = COLOR_MAPPING['白'];
	}

	// パスを判定
	if (m == PASS_FROM_WORD) {
		return `${c}[${PASS_TO_WORD}]`;
	}

	// 座標取得
	let p = m.split(DATA_DELIMITER);
	if (p.length > 2) {
		throw new Error(`${INVALID_ERROR_MSG}(${p})`);
	}
	let x = MOVE_MAPPING[p[0]];
	let y = MOVE_MAPPING[p[1]];

	return `${c}[${x}${y}]`;
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

function reset() {
	// テキストクリア
	document.getElementById('main_text').value = ''
	// 変換結果クリア
	let result_area = document.getElementById('result');
	result_area.value = ''
}
