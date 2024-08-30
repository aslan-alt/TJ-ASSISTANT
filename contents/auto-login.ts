import axios from "axios"

async function waitForElement(xpath, timeout = 3000) {
  const interval = 100
  const maxAttempts = timeout / interval
  let attempts = 0

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      attempts++
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      )
      const element = result.singleNodeValue

      if (element) {
        clearInterval(intervalId)
        resolve(element)
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId)
        resolve(null)
      }
    }, interval)
  })
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    await axios.post(
      "/login/",
      {
        returnPerson: true,
        email: request?.email,
        password: request?.password
      },
      {
        withCredentials: true
      }
    )
    location.reload()
  }
  if (request.action === "impersonate") {
    await axios.post(
      "/impersonate/",
      {
        targetUserId: request.userId,
        impersonation_tool: "a3g"
      },
      {
        withCredentials: true
      }
    )
    location.reload()
  }
})
