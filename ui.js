"use strict"
import * as Utils from "./utils.js"

document.addEventListener("DOMContentLoaded", async () => {
  let url = (await Utils.getCurrentTab()).url

  document.getElementById("crawl-title").addEventListener("click", async () => {
    let local = await chrome.storage.local.get(null)
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
    .addEventListener("click", async () => {
      await Utils.saveToPages(url)
    })

  document
    .getElementById("crawlbtn-delete")
    .addEventListener("click", async () => {
      await Utils.deleteFromTarget("pages", url)
      await Utils.deleteFromTarget("cache", url)
    })

  document
    .getElementById("crawlbtn-download")
    .addEventListener("click", async () => {
      Utils.download(
        JSON.stringify((await chrome.storage.local.get("pages")).pages),
        "crawling_list.json",
        "text/plain"
      )
    })

  document.getElementById("crawlbtn-clear").addEventListener("click", () => {
    chrome.storage.local.remove("pages", null)
    alert("Pages have been cleared.")
  })

  document
    .getElementById("crawlbtn-cache")
    .addEventListener("click", async () => {
      chrome.storage.local.remove("cache", null)
      alert("Cache has been cleared.")
    })
})
