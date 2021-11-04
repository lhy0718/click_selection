String.prototype.allReplace = function (obj) {
  var retStr = this
  for (var x in obj) {
    retStr = retStr.replace(new RegExp(x, "g"), obj[x])
  }
  return retStr
}

var generateQuerySelector = function (el) {
  if (!el) return ""
  if (el.tagName.toLowerCase() == "html") return "html"
  var str = el.tagName.toLowerCase()
  str += el.id != "" ? "#" + el.id : ""
  if (el.className) {
    var classes = el.className.split(/\s/)
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].trim() != "")
        str +=
          "." +
          classes[i].allReplace({
            ":": "\\:",
            "'": "\\'",
            '"': '\\"',
            "{": "\\{",
            "}": "\\}",
            "#": "\\#",
            ",": "\\,",
          })
    }
  }
  return generateQuerySelector(el.parentNode) + " " + str
}

var saveToCache = async function (page_data) {
  var cache = await chrome.storage.local.get(["cache"])
  var url = document.location.href
  var data = cache.cache ? cache.cache : {}
  data[url] = page_data
  chrome.storage.local.set({ cache: data }, null)
}

HIGHLIGHT_COLOR = "rgb(252, 247, 94)"
doc = {}
chrome.storage.local.get("toggle", function (result) {
  if (result.toggle) saveToCache(doc)
})

document.addEventListener(
  "click",
  async function (e) {
    var toggle = await chrome.storage.local.get("toggle")
    if (!toggle.toggle) return
    e = e || window.event
    var target = e.target,
      text = target.textContent || target.innerText,
      selector = generateQuerySelector(target),
      index = Array.prototype.slice
        .call(document.querySelectorAll(selector))
        .indexOf(target),
      id = selector + "~~" + index
    if (id.includes("crawlbtn")) return
    if (!doc[id]) {
      doc[id] = {}
      doc[id]["selector"] = selector
      doc[id]["nth-child"] = index
      doc[id]["text"] = text
      doc[id]["backgroundColor"] = target.style.backgroundColor
      doc[id]["textColor"] = target.style.color
      target.style.backgroundColor = HIGHLIGHT_COLOR
      target.style.color = "black"
    } else {
      target.style.backgroundColor = doc[id]["backgroundColor"]
      target.style.color = doc[id]["textColor"]
      delete doc[id]
    }
    saveToCache(doc)
    console.log(doc)
  },
  false
)
