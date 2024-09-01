export function generateLoginUrl({ baseUrl, email }) {
  const url = new URL(`${baseUrl}/auth/idp/login/auth0`)

  url.searchParams.append("auth_host", baseUrl)
  url.searchParams.append("connection", "CompassOkta")
  url.searchParams.append("login_hint", email)
  url.searchParams.append("redirect_uri", "/app/home")

  return url.toString()
}
