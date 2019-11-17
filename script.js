var defaultColor = '#fff2ab';
//[最新記事, 最新の固定化記事]]
let storageKeyList = ['latest', 'latestFixed', 'bgColor'];


window.onload = function () {
  this.getLatestId().then(function (latest) {
    var article = getArticles();
    return this.changeArticleStyle(article, latest);
  }).then(function (latest) {
    this.setLatestId(getArticles());
    sendMessageToBackground(latest.bgColor);
  });

  this.onMessageFromPopup();
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
    'latestFixed': latestFixed
  }, function () {});
};

/**
 * 背景色をchrome.storageに保存する
 * @param {*} color 
 */
var setBackgroundColor = function (color) {
  chrome.storage.local.set({
    'bgColor': color
  }, function () {
  });
}

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
    //更新記事の背景色を変更する
    latests.bgColor = (!latests.bgColor ? defaultColor : latests.bgColor);
    for (var a of article) {
      //色を変える条件
      if (latests == null || (a.id !== latests.latest && a.id !== latests.latestFixed)) {
        changeColor(a.id, latests.bgColor);
      } else if (a.id === latests.latestFixed) {
        continue;
      } else {
        break;
      }
    }
    resolve(latests);
  });
};

/**
 * すべての記事のDOMを取得
 */
var getArticles = function(){
  //下記ですべての記事のDOMを取得
  var article = new Array();
  //最初に読み込まれる記事を含むDOMを取得
  var docs = document.getElementsByClassName("ZkScQ");
  var length = docs.length;
  var subLength = docs[0].childNodes.length;
  for (var i = 0; i < subLength; i++) {
    for (var k = 0; k < length; k++) {
      article.push(docs[k].childNodes[i]);
    }
  }
  article = article.filter(n => n !== undefined);
  return article;
};

/**
 * 対象の記事の背景色を変える
 * @param {String} id 
 * @param {String} color
 */
var changeColor = function (id, color) {
  if (id == null || color == null) {
    return;
  }
  document.getElementById(id).childNodes[0].style.backgroundColor = color;
};

/**
 * ポップアップから受け取った情報を戻り値として返す
 */
var onMessageFromPopup = function () {
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    setBackgroundColor(message);
//    changeArticleStyle(getArticles(),message);
    return;
  });
};

/**
 * データをbackgroundへ送信する
 */
var sendMessageToBackground = function (sendValue) {
  chrome.runtime.sendMessage({
    value: sendValue
  });
};