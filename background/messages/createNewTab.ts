import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  chrome.tabs.create({ url: req.body.env.value }, (tab) => {
    chrome.webNavigation.onCompleted.addListener(
      function onCompleted(details) {
        if (details.tabId === tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            action: "login",
            ...req.body
          })
          const timerId = setTimeout(() => {
            chrome.webNavigation.onCompleted.removeListener(onCompleted)
            clearTimeout(timerId)
          }, 5000)
        }
      },
      { url: [{ urlMatches: req.body.env.value }] }
    )
  })
}

export default handler
