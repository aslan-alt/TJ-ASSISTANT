export const LOCAL_STORAGE_KEY_LOGIN = "LOGIN_CONFIGS";
export const LOCAL_STORAGE_KEY_IMPERSONATE = "IMPERSONATE_CONFIGS";



export const envOptions = [
  { value: "https://beta.compass.com", label: "Beta" },
  { value: "https://staging.compass.com", label: "Staging" },
  { value: "https://gamma.compass.com", label: "Gamma" },
  { value: "https://compass.com", label: "Product" }
]
export const roleOptions = [
  { value: "CAG", label: "Compass Agent" },
  { value: "AG", label: "Buyer or Seller" },
  { value: "Other", label: "Other" }
]


export const defaultUserConfigs = {
  userId: "",
  tag: "",
  email: "",
  password: "",
  env: envOptions[0],
  role: roleOptions[1]
}

export const defaultImpersonateConfigs = {
  userId: "",
  tag: "",
  env: envOptions[0]
}

export const xPathForLoginWays = {
  [roleOptions[0].value]: "/html/body/div[4]/div[2]/div[2]/div/button[1]",
  [roleOptions[1].value]: "/html/body/div[4]/div[2]/div[2]/div/button[2]",
  [roleOptions[2].value]: "/html/body/div[4]/div[2]/div[2]/div/button[3]"
}

export const logoutConfigs = [
  {
    xpath: "/html/body/div[3]/nav/div/footer/div[2]/a",
    event: "click"
  },
  {
    xpath: "/html/body/div[3]/nav/div/footer/div[1]/div[3]/a",
    event: "click"
  }
]

export enum BackgroundEvents {
  logout,
  login,
  checkUserStatus
}
