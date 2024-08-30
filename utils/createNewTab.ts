export const createNewTab = (url: string) => {
  return new Promise<{ success: boolean; tab: chrome.tabs.Tab }>((resolve) => {
    chrome.tabs.create({ url }, (tab) => {
      chrome.webNavigation.onCompleted.addListener(
        function onCompleted(details) {
          if (details.tabId === tab.id) {
            resolve({ success: true, tab })
            const timerId = setTimeout(() => {
              chrome.webNavigation.onCompleted.removeListener(onCompleted)
              clearTimeout(timerId)
            }, 5000)
          }
        },
        { url: [{ urlMatches: url }] }
      )
    })
  })
}
