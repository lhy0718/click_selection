const updateCache = async (page_data) => {
  let cache = await chrome.storage.local.get(["cache"])
  let url = document.location.href
  let data = cache.cache ? cache.cache : {}
  data[url] = page_data
  chrome.storage.local.set({ cache: data }, null)
}

const getAllSiblings = (elem) => {
  var sibs = []
  elem = elem.parentNode.firstChild
  do sibs.push(elem)
  while ((elem = elem.nextSibling))
  return sibs
}

HIGHLIGHT_COLOR = "rgba(252, 247, 94, 0.5)"
HIGHLIGHT_BORDER_COLOR = "rgba(200, 200, 94)"
doc = {}
chrome.storage.local.get("toggle", (result) => {
  if (result.toggle) updateCache(doc)
})

const getElementInfo = (domElement) => {
  let _text = domElement.textContent || domElement.innerText,
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
  domElement.style.backgroundColor = HIGHLIGHT_COLOR
  domElement.style.color = "black"
  domElement.style.border = "1px solid " + HIGHLIGHT_BORDER_COLOR
}

const removeFromDoc = (domElement) => {
  i = getElementInfo(domElement)
  domElement.style.backgroundColor = doc[i.id]["backgroundColor"]
  domElement.style.color = doc[i.id]["textColor"]
  domElement.style.border = "none"
  delete doc[i.id]
}

document.addEventListener(
  "click",
  async (e) => {
    if (!(await chrome.storage.local.get("toggle")).toggle) return

    e = e || window.event

    let target = e.target
    if (!doc[getElementInfo(target).id]) {
      if ((await chrome.storage.local.get("groupSelection")).groupSelection) {
        getAllSiblings(target).forEach((sibling) => {
          if (
            sibling.tagName &&
            target.tagName == sibling.tagName &&
            !doc[getElementInfo(sibling).id]
          )
            addToDoc(sibling)
        })
      } else {
        addToDoc(target)
      }
    } else {
      if ((await chrome.storage.local.get("groupSelection")).groupSelection) {
        getAllSiblings(target).forEach((sibling) => {
          if (
            sibling.tagName &&
            target.tagName == sibling.tagName &&
            doc[getElementInfo(sibling).id]
          )
            removeFromDoc(sibling)
        })
      } else {
        removeFromDoc(target)
      }
    }
    updateCache(doc)
    console.log(doc)
  },
  false
)
