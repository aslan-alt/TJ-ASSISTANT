export const getChromeCurrentTab = async () => {
  const queryOptions = { active: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
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
  console.log('tabId--------');
  console.log(tabId);
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

export async function findElementsAndTriger(targets) {
  for (const target of targets) {
    const { xpath, event, value } = target
    try {
      const element = await waitForElement(xpath)
      if (event === "click") {
        // @ts-ignore
        element.click()
      } else if (event === "input") {
        console.log(value)
        // @ts-ignore
        element.value = value
        // @ts-ignore
        element.dispatchEvent(new Event("input", { bubbles: true }))
      }
      await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms 延迟以确保事件完成
    } catch (error) {
      console.error(error)
    }
  }
}

export const onSendMessageToContent = (tabId,
  params
) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
        tabId,
        params,
        (result) => {
          resolve(result)
        }
    )
  })
}
