window.onload = function () {

  var beforeColor = "#000000";

  const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'monolith',
    showAlways: true,
    useAsButton: true,

    swatches: [
      '#f23d3d',
      '#ffbaa1',
      '#fff2ab',
      '#cbf1c4',
      '#ffcce5',
      '#e7cfff',
      '#cde9ff',
      '#f9f9f9'
    ],

    default: '#fff2ab',

    components: {
      preview: true,
      opacity: true,
      hue: true,

      interaction: {
        rgba: true,
        hex: true,
        input: true,
        cancel: true,
        save: true
      }
    },

    strings: {
      save: '適用',
      cancel: 'キャンセル'
    }
  });

  pickr.on('init', function (e) {
    var current = onValueFromBackground();
    if (current == null || !current) {
      return;
    }
    pickr.setColor(current);
  }).on('show',function(e){
    var current = onValueFromBackground();
    if (current == null || !current) {
      return;
    }
    beforeColor = current;
    pickr.setColor(current);
  }).on('save', function (color, e) {
    if(color){
    sendToContents(color.toHEXA().toString());
    }
  }).on('cancel', function (e) {
  });
};

/**
 * backgroundから受け取ったValue戻り値として返す。
 */
var onValueFromBackground = function () {
  if(!chrome.extension.getBackgroundPage()){
    return null;
  }
  return chrome.extension.getBackgroundPage().toPopupValue;
};

/**
 * content.jsに選択した色を送る
 * @param {*} color 
 */
var sendToContents = function (color) {
  console.log(color);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id,
      color,
      function (response) {
      });
  });
};