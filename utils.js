export const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true }
  let tabs = await chrome.tabs.query(queryOptions)
  return tabs[0]
}

export const sendAlertMsgToCurrentTab = async (msg) => {
  chrome.tabs.sendMessage((await getCurrentTab()).id, {
    type: "alert",
    msg: msg,
  })
}

export const saveToPages = async (url) => {
  let cache = await chrome.storage.local.get(["cache"])
  if (cache.cache && cache.cache[url]) {
    let pageCache = cache.cache[url]
    console.log(pageCache)
    Object.values(pageCache).forEach((value) => {
      delete value["backgroundColor"]
      delete value["textColor"]
    })
    console.log(pageCache)

    let pages = await chrome.storage.local.get(["pages"])
    let data = pages.pages ? pages.pages : {}
    data[url] = pageCache
    chrome.storage.local.set({ pages: data }, () => {
      var error = chrome.runtime.lastError
      if (error) sendAlertMsgToCurrentTab("Crawler error: " + error.message)
      else sendAlertMsgToCurrentTab("page has been saved. \nurl: " + url)
    })
  } else {
    sendAlertMsgToCurrentTab("There are nothing to save!")
  }
}

export const deleteFromTarget = async (target, url) => {
  let targetStorage = await chrome.storage.local.get([target])
  if (targetStorage[target] && targetStorage[target][url]) {
    delete targetStorage[target][url]
    chrome.storage.local.set(targetStorage, () => {
      var error = chrome.runtime.lastError
      if (error) sendAlertMsgToCurrentTab("Crawler error: " + error.message)
      else sendAlertMsgToCurrentTab(target + " has been delete. \nurl: " + url)
    })
  } else sendAlertMsgToCurrentTab("There are nothing to delete!")
}

export const download = (content, fileName, contentType) => {
  let a = document.createElement("a")
  let file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export const updateBadgeText = async () => {
  let pages = await chrome.storage.local.get(["pages"])
  let badgeText = pages.pages ? Object.keys(pages.pages).length : ""
  chrome.action.setBadgeText({ text: badgeText.toString() }, null)
}
