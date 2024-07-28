import { xPathMap, type defaultUserConfigs } from "~constants"
import { isSameOrigin } from "~utils/urlTools"

async function waitForElement(xpath, timeout = 3000) {
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
        reject(`Element not found for XPath: ${xpath} within ${timeout}ms`)
      }
    }, interval)
  })
}
const creatLoginConfigs = (userConfigs: typeof defaultUserConfigs) => {
  return [
    {
      xpath: "/html/body/nav/nav/div[1]/div[2]/button", // Sign in
      event: "click"
    },
    {
      xpath: xPathMap[userConfigs.role.value], // select role
      event: "click"
    },
    {
      xpath: "/html/body/div[4]/div[2]/div[2]/div/button[5]",
      event: "click"
    },
    {
      xpath: "/html/body/div[4]/div[2]/div[2]/div/form/label/input",
      event: "input",
      value: userConfigs.email
    },
    {
      xpath: '//*[@id="continue"]',
      event: "click"
    },
    {
      xpath: "/html/body/div[4]/div[2]/div[2]/div/form/div/label/input",
      event: "input",
      value: userConfigs.password
    },
    {
      xpath: '//*[@id="continue"]',
      event: "click"
    }
  ]
}

async function executeTargets(targets) {
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
      await new Promise((resolve) => setTimeout(resolve, 3000)) // 500ms 延迟以确保事件完成
    } catch (error) {
      console.error(error)
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "login") {
    executeTargets(creatLoginConfigs({ ...request })).then(() => {
      console.log("全部执行完毕")
    })
  }
})
