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
    .getElementById("group-selection")
    .addEventListener("change", (event) => {
      chrome.storage.local.set({ groupSelection: event.currentTarget.checked })
    })

  document.getElementById("group-selection").checked = (
    await chrome.storage.local.get("groupSelection")
  ).groupSelection

  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    document.getElementById("toggle-crawler").checked = (
      await chrome.storage.local.get("toggle")
    ).toggle
    document.getElementById("group-selection").checked = (
      await chrome.storage.local.get("groupSelection")
    ).groupSelection
  })

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
    if (confirm("Pages will be cleared.")) {
      alert("Pages have been cleared.")
      chrome.storage.local.remove("pages", null)
    }
  })

  document.getElementById("crawlbtn-cache").addEventListener("click", () => {
    if (confirm("Cache will be cleared.")) {
      alert("Cache has been cleared.")
      chrome.storage.local.remove("cache", null)
    }
  })
})
