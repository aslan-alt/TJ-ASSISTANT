import axios from "axios"

import { loginRequest, logoutRequest } from "~contentSendRequests"

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    const isLogin = request.action === "login"
    if (isLogin) {
      await logoutRequest()
    }
    await loginRequest({
      email: request.email,
      password: request.password
    })
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
