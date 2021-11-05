export const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true }
  let tabs = await chrome.tabs.query(queryOptions)
  return tabs[0]
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
    chrome.storage.local.set({ pages: data }, null)
    chrome.scripting.executeScript(
      {
        target: { tabId: (await getCurrentTab()).id },
        func: () => {
          // A JavaScript function to inject.
          // This function will be serialized, and then deserialized for injection.
          // This means that any bound parameters and execution context will be lost.
          var currentUrl = document.location.href
          alert("Page has been saved.\nurl: " + currentUrl)
        },
      },
      null
    )
  } else alert("There are nothing to save!")
}

export const deleteFromTarget = async (target, url) => {
  let targetStorage = await chrome.storage.local.get([target])
  if (targetStorage[target] && targetStorage[target][url]) {
    delete targetStorage[target][url]
    chrome.storage.local.set(targetStorage, null)
    alert(`${target} has been delete.\nurl: ${url}`)
  } else alert(`There are nothing to delete!: ${target}`)
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
