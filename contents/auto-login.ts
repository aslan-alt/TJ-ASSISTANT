import axios from "axios"

import {
  impersonateRequest,
  loginRequest,
  logoutRequest,
  stopImpersonateRequest
} from "~contentSendRequests"

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "login") {
    const isLogin = !!request?.user?.email
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
    if (request?.user?.isImpersonating) {
      await stopImpersonateRequest()
    }
    await impersonateRequest(request.userId)
    location.reload()
  }
})
