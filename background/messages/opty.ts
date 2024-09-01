import { type PlasmoMessaging } from "@plasmohq/messaging"

let timerId = null

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const optyConfigs = req.body

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
      const urlObj = new URL(tab.url)

      console.log("urlObj.searchParams--------")
      console.log(urlObj)
      console.log(tab.url)
      // 检查是否匹配特定路径
      // if (urlObj.pathname === "/app/lab/overview") {
      //   // 添加参数
      //   urlObj.searchParams.append("opty_bt_cross_sharing", "true")
      //
      //   // 更新Tab的URL
      //   chrome.tabs.update(tabId, { url: urlObj.toString() })
      // }
    }
  })
}

export default handler
