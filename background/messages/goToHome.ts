import type { PlasmoMessaging } from "@plasmohq/messaging"
import {getChromeCurrentTab} from "~utils/chromeMethods";

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
    const currentTab = await getChromeCurrentTab()
    const tabId = currentTab.id;

    chrome.tabs.update(tabId, { url: req.body.env.value }).then(result=>{
        chrome.webNavigation.onCompleted.addListener(function onCompleted(details) {
            if (details.tabId === tabId) {

                res.send({
                    status: "success",
                    tabId
                })
               const timerId = setTimeout(()=>{
                   chrome.webNavigation.onCompleted.removeListener(onCompleted);
                   clearTimeout(timerId)
               },5000)
            }
        }, { url: [{ urlMatches: req.body.env.value }] });

    });

}

export default handler