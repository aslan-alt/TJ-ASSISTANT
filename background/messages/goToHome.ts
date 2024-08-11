import type { PlasmoMessaging } from "@plasmohq/messaging"
import {getChromeCurrentTab} from "~utils/chromeMethods";

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
    const currentTab = await getChromeCurrentTab()
    const tabId = currentTab.id
    chrome.tabs.update(tabId, { url: req.body.env.value }).then(result=>{
        res.send({
            status: "success",
            tabId,
            message: `Redirected to home page`
        })
    });

}

export default handler