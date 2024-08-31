import type { PlasmoMessaging } from "@plasmohq/messaging"


const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") })
}

export default handler
