export const localStorageKeyLogin = "loginConfigs"

export const envOptions = [
  { value: "https://beta.compass.com/", label: "Beta" },
  { value: "https://staging.compass.com/", label: "Staging" },
  { value: "https://gamma.compass.com/", label: "Gamma" },
  { value: "https://compass.com/", label: "Product" }
]

export const defaultUserConfigs = {
  tag: "",
  email: "",
  password: "",
  env: envOptions[0],
  role: "agent" // defaultValue
}
