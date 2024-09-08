export type AccountItem = {
  TeamId?: string
  displayName?: string
  email: string
  notes?: string
  password?: string
  role?: (typeof roleOptions)[1]
  teamName?: string
  userId?: string
  env?: (typeof envOptions)[0]
  tag?: string
  createdAt: string
}

export const envOptions = [
  { value: "https://beta.compass.com", label: "Beta" },
  { value: "https://staging.compass.com", label: "Staging" },
  { value: "https://gamma.compass.com", label: "Gamma" },
  { value: "https://dev.local.compass.com:5443/", label: "Dev" },
  { value: "placeholder", label: "DemoBox" }
]
export const roleOptions = [
  { value: "CAG", label: "Compass Agent" },
  { value: "AG", label: "Buyer or Seller" },
  { value: "Other", label: "Other" }
]

export const defaultUserConfigs: Omit<AccountItem, "createdAt"> = {
  tag: "",
  email: "",
  password: "",
  env: envOptions[0],
  role: roleOptions[1],
  userId: ""
}
