import axios from "axios"

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    await axios.post(
      "/login/",
      {
        returnPerson: true,
        email: request?.email,
        password: request?.password
      },
      {
        withCredentials: true
      }
    )
    location.reload()
  }
  if (request.action === "impersonate") {
    await axios.post(
      "/impersonate/",
      {
        targetUserId: request.userId,
        impersonation_tool: "a3g"
      },
      {
        withCredentials: true
      }
    )
    location.reload()
  }
})
