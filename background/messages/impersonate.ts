
import type { PlasmoMessaging } from "@plasmohq/messaging"
import {getChromeCurrentTab} from "~utils/chromeMethods";

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
    const currentTab = await getChromeCurrentTab()
    const tabId = currentTab.id;

    chrome.tabs.update(tabId, { url: `${req.body.env.value}/internal/a3g/agents/663a7be1713ed80001f34fab/overview` }).then(result=>{
        chrome.webNavigation.onCompleted.addListener(function onCompleted(details) {
            if (details.tabId === tabId) {
                chrome.tabs.sendMessage(tabId, {
                    action: "impersonate",
                    ...req.body
                });
                const timerId = setTimeout(()=>{
                    chrome.webNavigation.onCompleted.removeListener(onCompleted);
                    clearTimeout(timerId)
                },5000)
            }
        }, { url: [{ urlMatches:  `${req.body.env.value}/internal/a3g/agents/663a7be1713ed80001f34fab/overview` }] });

    });

}

export default handler