import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getChromeCurrentTab } from "~utils/chromeMethods"
import { getWindowUC } from "~utils/getWindowUC"

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const currentTab = await getChromeCurrentTab()
  const tabId = currentTab.id
  const windowUC = await getWindowUC(tabId)
  chrome.tabs.sendMessage(tabId, {
    action: "impersonate",
    // @ts-ignore
    user: windowUC?.user,
    ...req.body
  })
}

export default handler
