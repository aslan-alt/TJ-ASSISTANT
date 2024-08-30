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
