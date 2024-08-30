import { sendToBackground, type PlasmoMessaging } from "@plasmohq/messaging"

import { getChromeCurrentTab } from "~utils/chromeMethods"
import { getWindowUC } from "~utils/getWindowUC"

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const loginConfigs = req.body
  const tab = await getChromeCurrentTab()
  const windowUC = await getWindowUC(tab.id)

  if (!tab.url) {
    // TODO: createNewTab
  } else {
    const url = new URL(tab.url)
    const currentHost = url.host

    if (loginConfigs.env.value.includes(currentHost)) {
      chrome.tabs.sendMessage(tab.id, {
        action: "login",
        user: windowUC?.user,
        ...loginConfigs
      })
    } else {
      // TODO: createNewTab
    }
  }
}

export default handler
