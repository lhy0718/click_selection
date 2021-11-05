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
    default:
      break
  }
})
