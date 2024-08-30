import getWindowUc from "~background/injected-helper"

export const getWindowUC = (tabId: number) => {
  return new Promise<void>((resolve) => {
    chrome.scripting.executeScript(
      {
        target: {
          tabId: tabId // the tab you want to inject into
        },
        world: "MAIN", // MAIN to access the window object
        func: getWindowUc
      },
      (results) => {
        resolve(results?.[0]?.result)
      }
    )
  })
}
