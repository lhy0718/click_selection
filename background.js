// set badge text
chrome.storage.onChanged.addListener(async function (changes, namespace) {
  var pages = await chrome.storage.local.get(["pages"])
  badgeText = pages.pages ? Object.keys(pages.pages).length : ""
  chrome.action.setBadgeText({ text: badgeText.toString() }, null)
})
