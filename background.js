"use strict"
import * as Utils from "./utils.js"

// set badge text
chrome.runtime.onInstalled.addListener(async () => {
  await Utils.updateBadgeText()
})

chrome.runtime.onStartup.addListener(async () => {
  await Utils.updateBadgeText()
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  await Utils.updateBadgeText()
})

// shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "save_this_page":
      let url = (await Utils.getCurrentTab()).url
      await Utils.saveToPages(url)
      break
    case "toggle_crawler":
      chrome.storage.local.set({
        toggle: !(await chrome.storage.local.get("toggle")).toggle,
      })
      break
    case "toggle_selection_mode":
      chrome.storage.local.set({
        groupSelection: !(await chrome.storage.local.get("groupSelection"))
          .groupSelection,
      })
      break
    default:
      break
  }
})
