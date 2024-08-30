import axios from "axios"

export const loginRequest = ({
  email,
  password
}: {
  email: string
  password: string
}) => {
  return axios.post(
    "/login/",
    { returnPerson: true, email, password },
    {
      withCredentials: true
    }
  )
}

export const logoutRequest = () => {
  return axios.post("/logout?source=account_page/", {
    withCredentials: true
  })
}

export const impersonateRequest = (userId: string) => {
  return axios.post(
    "/impersonate/",
    {
      targetUserId: userId,
      impersonation_tool: "a3g"
    },
    {
      withCredentials: true
    }
  )
}

export const stopImpersonateRequest = () => {
  return axios.post(
    "/unimpersonate/",
    {
      impersonation_tool: "impersonation_banner"
    },
    {
      withCredentials: true
    }
  )
}
