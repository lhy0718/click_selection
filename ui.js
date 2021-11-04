async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

var saveToPages = async function (url) {
  var cache = await chrome.storage.local.get(["cache"])
  if (cache.cache && cache.cache[url]) {
    var pageCache = cache.cache[url]
    console.log(pageCache)
    Object.values(pageCache).forEach((value) => {
      delete value["backgroundColor"]
      delete value["textColor"]
    })
    console.log(pageCache)

    var pages = await chrome.storage.local.get(["pages"])
    var data = pages.pages ? pages.pages : {}
    data[url] = pageCache
    chrome.storage.local.set({ pages: data }, null)
    alert("Page has been saved.")
  } else alert("There are nothing to save!")
}

var deleteFromTarget = async function (target, url) {
  var targetStorage = await chrome.storage.local.get([target])
  if (targetStorage[target] && targetStorage[target][url]) {
    delete targetStorage[target][url]
    chrome.storage.local.set(targetStorage, null)
  } else alert(`There are nothing to delete!: ${target}`)
}

function download(content, fileName, contentType) {
  var a = document.createElement("a")
  var file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

document.addEventListener("DOMContentLoaded", async function () {
  var currentTab = await getCurrentTab()
  var url = currentTab.url

  document
    .getElementById("crawl-title")
    .addEventListener("click", async function () {
      var local = await chrome.storage.local.get(null)
      console.log("local storage:", local)
    })

  document.getElementById("toggle-crawler").checked = (
    await chrome.storage.local.get("toggle")
  ).toggle

  document
    .getElementById("toggle-crawler")
    .addEventListener("change", (event) => {
      chrome.storage.local.set({ toggle: event.currentTarget.checked })
    })

  document
    .getElementById("crawlbtn-save")
    .addEventListener("click", async function () {
      await saveToPages(url)
    })

  document
    .getElementById("crawlbtn-delete")
    .addEventListener("click", async function () {
      await deleteFromTarget("pages", url)
      await deleteFromTarget("cache", url)
    })

  document
    .getElementById("crawlbtn-download")
    .addEventListener("click", async function () {
      download(
        JSON.stringify((await chrome.storage.local.get("pages")).pages),
        "crawling_list.json",
        "text/plain"
      )
    })

  document
    .getElementById("crawlbtn-clear")
    .addEventListener("click", function () {
      chrome.storage.local.remove("pages", null)
      alert("Pages have been cleared.")
    })

  document
    .getElementById("crawlbtn-cache")
    .addEventListener("click", async function () {
      chrome.storage.local.remove("cache", null)
      alert("Cache has been cleared.")
    })
})
