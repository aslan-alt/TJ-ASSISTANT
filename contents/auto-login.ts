import { xPathMap, type defaultUserConfigs } from "~constants"

const loginButton = "/html/body/nav/nav/div[1]/div[2]/button"

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
const creatLoginConfigs = (userConfigs: typeof defaultUserConfigs) => {
  return [
    {
      xpath: loginButton, // Sign in
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
const logoutConfigs = [
  {
    xpath: "/html/body/nav/nav/div[1]/div[2]/a",
    event: "click"
  },
  {
    xpath: '//*[@id="agent-home"]/nav/div/footer/div[2]',
    event: "click"
  },
  {
    xpath: '//*[@id="agent-home"]/nav/div/footer/div[1]/div[3]',
    event: "click"
  }
]

async function executeTargets(targets) {
  for (const target of targets) {
    const { xpath, event, value } = target
    try {
      const element = await waitForElement(xpath)
      if (!element) return
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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    const element = await waitForElement(loginButton)
    console.log("element-------")
    console.log(element)
    // @ts-ignore
    console.log(element?.textContent)
    // @ts-ignore
    if (element?.textContent !== "Register/Sign In" || !element) {
      await executeTargets(logoutConfigs)
    } else {
      executeTargets(creatLoginConfigs({ ...request })).then(() => {
        console.log("全部执行完毕")
      })
    }
  }
})
