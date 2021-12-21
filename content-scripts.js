chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "alert":
      alert(request.msg)
      break
    case "confirm":
      confirm(request.msg)
    default:
      break
  }
})

HIGHLIGHT_COLOR = "rgba(252, 247, 94, 0.5)"
HIGHLIGHT_TEXT_COLOR = "black"
HIGHLIGHT_BORDER = "3px solid rgba(200, 200, 94)"

doc = {}

const updateCache = async (page_data) => {
  let cache = await chrome.storage.local.get(["cache"])
  let currentURL = document.location.href
  let data = cache.cache ? cache.cache : {}
  data[currentURL] = page_data
  chrome.storage.local.set({ cache: data }, () => {
    var error = chrome.runtime.lastError
    if (error) sendAlertMsgToCurrentTab("Crawler error: " + error.message)
  })
}

chrome.storage.local.get("toggle", (result) => {
  if (result.toggle) updateCache(doc)
})

const getElementInfo = (domElement) => {
  let _text = domElement.innerText,
    _selector = domElement.tagName.toLowerCase(),
    _index = Array.prototype.slice
      .call(document.querySelectorAll(_selector))
      .indexOf(domElement),
    _id = _selector + "~~" + _index

  return { text: _text, selector: _selector, index: _index, id: _id }
}

const addToDoc = (domElement) => {
  i = getElementInfo(domElement)
  doc[i.id] = {}
  doc[i.id]["selector"] = i.selector
  doc[i.id]["nth-child"] = i.index
  doc[i.id]["text"] = i.text
  doc[i.id]["backgroundColor"] = domElement.style.backgroundColor
  doc[i.id]["textColor"] = domElement.style.color
  doc[i.id]["border"] = domElement.style.border
  domElement.style.backgroundColor = HIGHLIGHT_COLOR
  domElement.style.color = HIGHLIGHT_TEXT_COLOR
  domElement.style.border = HIGHLIGHT_BORDER
}

const removeFromDoc = (domElement) => {
  i = getElementInfo(domElement)
  domElement.style.backgroundColor = doc[i.id]["backgroundColor"]
  domElement.style.color = doc[i.id]["textColor"]
  domElement.style.border = doc[i.id]["border"]
  delete doc[i.id]
}

const getAllSiblings = (elem) => {
  var sibs = []
  elem = elem.parentNode.firstChild
  do sibs.push(elem)
  while ((elem = elem.nextSibling))
  return sibs
}

document.addEventListener(
  "click",
  async (e) => {
    if (!(await chrome.storage.local.get("toggle")).toggle) return

    e = e || window.event

    let target = e.target

    if ((await chrome.storage.local.get("groupSelection")).groupSelection) {
      if (!doc[getElementInfo(target).id]) {
        getAllSiblings(target).forEach((sibling) => {
          if (
            sibling.tagName &&
            target.tagName == sibling.tagName &&
            !doc[getElementInfo(sibling).id]
          )
            addToDoc(sibling)
        })
      } else {
        getAllSiblings(target).forEach((sibling) => {
          if (
            sibling.tagName &&
            target.tagName == sibling.tagName &&
            doc[getElementInfo(sibling).id]
          )
            removeFromDoc(sibling)
        })
      }
    } else {
      if (!doc[getElementInfo(target).id]) addToDoc(target)
      else removeFromDoc(target)
    }
    updateCache(doc)
    console.log(doc)
  },
  false
)
