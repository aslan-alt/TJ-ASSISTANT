export const getChromeCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true,currentWindow: true })
  return tab
}

export async function waitForElement(xpath, timeout = 5000) {
  const interval = 100
  const maxAttempts = timeout / interval
  let attempts = 0

  return new Promise((resolve, reject) => {
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
        reject(`Element not found`)
      }
    }, interval)
  })
}

export const executeScript = async ({ tabId, func, args = [] }) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func,
        args // 传递参数给操作函数
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject({ error: chrome.runtime.lastError })
        } else {
          resolve(results)
        }
      }
    )
  })
}




