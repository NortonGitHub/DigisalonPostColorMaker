var backColor = '#fff2ab';
//[最新記事, 最新の固定化記事]]
let storageKeyList = ['latest','latestFixed'];


window.onload = function () {
  var article = new Array();

  //最初に読み込まれる記事を含むDOMを取得
  var docs = document.getElementsByClassName("ZkScQ");

  //下記ですべての記事のDOMを取得
  var length = docs.length;
  var subLength = docs[0].childNodes.length;
  for (var i = 0; i < subLength; i++) {
    for (var k = 0; k < length; k++) {
      article.push(docs[k].childNodes[i]);
    }
  }
  article = article.filter(n => n !== this.undefined);

  this.getLatestId().then(function (latest) {
    return this.changeArticleStyle(article, latest);
  }).then(function () {
    this.setLatestId(article);
  });
};

/**
 * chrome.storageから最後に記録された最新の記事IDを読み込む
 */
var getLatestId = function () {
  return new Promise(function (resolve) {
    chrome.storage.local.get(
      storageKeyList,
      function (result) {
        resolve(result);
      });
  });
}

/**
 * 最新のIdをchrome.storageに保存する
 * @param {*} article 
 */
var setLatestId = function (article) {
  //最新の記事を取得する
  var latest = (isFixed(article) ? article[1].id : article[0].id);
  var latestFixed = (isFixed(article) ? article[0].id : null);

  chrome.storage.local.set({
    'latest': latest,
    'latestFixed' : latestFixed
  }, function () {});
};

/**
  *引数の要素がトップページに固定化されているかを検索する
  @param {NodeObject} block
 */
var isFixed = function (block) {
  return !(block[0].getElementsByClassName("_38zQp")[0] == null);
};

/**
 * 記事のstyleを変更する
 * @param {NodeObject[]} article 
 * @param {NodeObject} latest 
 */
var changeArticleStyle = function (article, latests) {
  return new Promise(function (resolve) {
    for (var a of article) {
      //色を変える条件
      if (latests == null || (a.id !== latests.latest && a.id !== latests.latestFixed)) {
        changeColor(a.id);
      }
      else if(a.id === latests.latestFixed){
        continue;
      }
      else {
        break;
      }
    }
    resolve(true);
  });
};

/**
 * 対象の記事の背景色を変える
 * @param {String} id 
 */
var changeColor = function (id) {
  if (id == null) {
    return;
  }
  document.getElementById(id).childNodes[0].style.backgroundColor = backColor;
};