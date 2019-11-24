var toPopupValue = "";

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'www.digimonsalon.com'
        },
      })
    ],
    actions: [
      new chrome.declarativeContent.ShowPageAction()
    ]
  }])
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  toPopupValue = request.value;
});