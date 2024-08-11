import type { PlasmoMessaging } from "@plasmohq/messaging"
import {getChromeCurrentTab} from "~utils/chromeMethods";

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
    const currentTab = await getChromeCurrentTab()
    const tabId = currentTab.id;

    chrome.tabs.update(tabId, { url: req.body.env.value }).then(result=>{
        chrome.webNavigation.onCompleted.addListener(function onCompleted(details) {
            if (details.tabId === tabId) {
                chrome.tabs.sendMessage(details.tabId, {
                    action: "login",
                    ...req.body
                });
                chrome.webNavigation.onCompleted.removeListener(onCompleted);
            }
        }, { url: [{ urlMatches: req.body.homeUrl }] });

    });

}

export default handler