import { type PlasmoMessaging } from "@plasmohq/messaging"

import { getChromeCurrentTab } from "~utils/chromeMethods"
import { createNewTab } from "~utils/createNewTab"
import { getWindowUC } from "~utils/getWindowUC"
import { generateLoginUrl } from "~utils/urlTools"

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const loginConfigs = req.body
  const tab = await getChromeCurrentTab()
  const windowUC = tab?.id ? await getWindowUC(tab?.id) : {}

  if (req.body.tag === "Main") {
    await createNewTab(
      generateLoginUrl({
        baseUrl: req.body.env.value,
        email: req.body.email
      })
    )
    return
  }

  // open a new tab and then log in if user open the plug-in on an empty page
  if (!tab?.url) {
    const { success, tab: newTab } = await createNewTab(req.body.env.value)
    if (success) {
      chrome.tabs.sendMessage(newTab.id, {
        action: "login",
        // @ts-ignore
        user: windowUC?.user,
        ...loginConfigs
      })
    }
  } else {
    const url = new URL(tab.url)
    const currentHost = url.host
    //If the user is on the compass page and the newly logged in account is in the same environment
    if (loginConfigs.env.value.includes(currentHost)) {
      chrome.tabs.sendMessage(tab.id, {
        action: "login",
        // @ts-ignore
        user: windowUC?.user,
        ...loginConfigs
      })
    } else {
      const { success, tab: newTab } = await createNewTab(req.body.env.value)
      if (success) {
        chrome.tabs.sendMessage(newTab.id, {
          action: "login",
          // @ts-ignore
          user: windowUC?.user,
          ...loginConfigs
        })
      }
    }
  }
}

export default handler
