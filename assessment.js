'use strict';//use strict（厳格モード）は、宣言後の記述ミスをエラーとして表示してくれる機能を呼び出す
const userNameInput = document.getElementById('user-name');//設定したidを使って要素を取得する
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {//関数として定義＆診断結果表示エリアに"removeAllChildren~"を追加することで、そこのwhile文を↓のように簡略化できる
    while (element.firstChild) {//子どもの要素がある限り削除
        element.removeChild(element.firstChild);
    }
}

//テキスト入力欄でEnterキーを押した際にも診断結果が出るようにする（下の段落の診断ボタンをクリックしたときの処理とは分ける！）
userNameInput.onkeydown = (event) => {//無名関数(onkeydown)を使って、キーが押されたときに動くようにする
    if (event.key === 'Enter') {//event.keyで、押されたキーの名前を取得
        assessmentButton.onclick();//ボタンのonclick()処理を呼び出す
    }
};

//assessmentButton.onclick=function(){//無名関数(名前をもたない関数)を使って、ボタンがクリックされたときに動くようにする
assessmentButton.onclick = () => {//上の行のfunctionを=>に簡略化して書いた方法（アロー関数）
    const userName = userNameInput.value;//テキストエリアに入力された文字列を受け取る
    if (userName.length === 0) {//名前が空（未入力）の場合は、戻り値なしにそこで処理を終了する(return)。（＝ガード句）
        return;
    }
    console.log(userName);

    //診断結果表示エリアの作成
    removeAllChildren(resultDivided);
    //while (resultDivided.firstChild){//while文=論理式がtrueの場合に実行し続ける//子どもの要素がある限り削除（trueでない場合は、false, null, undefined, 空文字列'', 数値の 0, 数値のNaN(数値にできない非数）など
    //resultDivided.removeChild(resultDivided.firstChild);//removeChild=指定された子要素を削除する関数。ここでは、複数回診断した際に前の診断結果を削除する
    //}
    const header = document.createElement('h3');//createElement=要素を作成する
    //document.writeは、~write('<p>内容</p>')と記述する必要があり、後からタグの内容を変更したいときに面倒だが、document.createElementは、<p></p>を作成し、後からinnerTextでタグの中身を設定できる
    header.innerText = '診断結果';//innerText=内側のテキスト
    resultDivided.appendChild(header);//appendChild=div要素を親、h3のheader(見出し)を子要素として追加

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    //ツイートエリアの作成
    removeAllChildren(tweetDivided);
    const anchor = document.createElement('a');//htmlでリンクを貼ったやつのJavaScript ver.
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag='//hrefのJS ver.
        + encodeURIComponent('あなたのいいところ')//+を使った文字列結合で、URIエンコード（半角英数字以外の文字を半角英数字に変換する）された"あなたのいいところ"を結合
        + '&ref_src=twsrc%5Etfw';//もとのURLの残り

    anchor.setAttribute('href', hrefValue);
    anchor.className = 'twitter-hashtag-button';//リンクのclassのところ
    anchor.setAttribute('data-text', result);//リンクのdata-textのところ（resultは、診断結果が入っている変数）
    anchor.innerText = 'Tweet #あなたのいいところ';//

    tweetDivided.appendChild(anchor);

    //widgets.jsを設定して、ツイッターリンクをちゃんとしたツイートボタンにする
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');//HTMLのリンクの後半部分
    tweetDivided.appendChild(script);//widgets.jsは、HTMLの序盤の言語(lang)属性を読み取り、ツイートボタンの言語に反映する→ちゃんとjaに設定しようね
};


const answers = [//constは定数（一度数を代入すると値を後から変更できない）
    //letとconstは{ }のスコープの中でしか変数を利用できないという宣言。letは変数を変更できる
    '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
    '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
    '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
    '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
    '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
    '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
    '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
    '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
    '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
    '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
    '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
    '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
    '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
    '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
    '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
    '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
]
/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName ユーザーの名前　（userNameという引数でユーザーの名前の文字列が渡される）
 * @return {string} 診断結果　（戻り値は診断結果の文字列になる）
 */
function assessment(userName) {
    //診断処理を実装する

    //全文字のコード番号（文字に対応した数字）を取得してそれを足し合わせる
    let sumOfCharCode = 0;
    for (let i = 0; i < userName.length; i++) {//for文で、全ての文字のコードを足す
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);//letは{ }内のみ有効なので安全
    }
    //文字のコード番号の合計を回答の数で割って添字の数値を求める
    const index = sumOfCharCode % answers.length;//文字コードの合計を結果パターン数で割った余り
    let result = answers[index];//余りの数に応じた結果パターンを出す（関数result.replaceの戻り値を再代入するためにletを用いる）

    //{userName}をユーザーの名前に置き換える
    return result.replace(/\{userName\}/g, userName);
    //↑ 正規表現（/\{userName\}/g）によって文字列自身に合うものを複数回適用する
    // \+特殊文字=特殊文字({ })を、何かの操作でなくただの文字列として扱う/ /=正規表現であることの区分け、g=グローバルサーチ
}

//console.log(assessment('太郎')); （←デベロッパーコンソールできちんと表示されるかの確認）
//console.log(assessment('次郎'));
//console.log(assessment('太郎'));

console.assert(//出力が正しいかテストを行う機能
    assessment('太郎') === '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',//assessment()内の文字が文中に正しく当てはまるときにtrueとなる式
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'//テストの結果が間違っているときに出すメッセージ
);
console.assert(
    assessment('太郎') === assessment('太郎'),//代入する文字が「太郎」なら同じ結果を出す
    '入力が同じ名前なら同じ診断結果を出力する処理が正しくありません。'
)
