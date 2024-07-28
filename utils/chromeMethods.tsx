export const getChromeCurrentTab = async () => {
  const queryOptions = { active: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}
