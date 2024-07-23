import { useEffect, useState } from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"

const defaultValues = {
  userName: "",
  password: ""
}

const localStorageKey = "loginConfigs"

function IndexPopup() {
  const [userNameAndPassword, setUserNameAndPassword] = useState(defaultValues)

  const [error, setError] = useState<string | null>(null)

  const [accountAndConfigs, setAccountAndConfigs] = useState([])

  useEffect(() => {
    setAccountAndConfigs(
      JSON.parse(localStorage.getItem(localStorageKey) || "[]")
    )
  }, [])

  const handleLogin = (loginConfigs: typeof userNameAndPassword) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "login",
        ...loginConfigs
      })
    })
  }
  return (
    <Container>
      {error ? <div>{error}</div> : null}
      {accountAndConfigs?.length ? (
        accountAndConfigs.map((item) => {
          return (
            <UserItem id={item.userId}>
              <div>{item.userName}</div>
              <div>{item.password}</div>
              <button
                onClick={() => {
                  const filteredConfigs = accountAndConfigs.filter(
                    (accountConfig) => accountConfig.userId !== item.userId
                  )
                  localStorage.setItem(
                    localStorageKey,
                    JSON.stringify(filteredConfigs || "[]")
                  )
                  setAccountAndConfigs(filteredConfigs)
                }}>
                remove
              </button>
              <LoginButton
                onClick={() => {
                  handleLogin(item)
                }}>
                login
              </LoginButton>
            </UserItem>
          )
        })
      ) : (
        <div>请添加账号</div>
      )}
      <div>
        <input
          type="text"
          onChange={(e) =>
            setUserNameAndPassword({
              ...userNameAndPassword,
              userName: e.target.value
            })
          }
          value={userNameAndPassword.userName}
        />
        <input
          type="text"
          onChange={(e) =>
            setUserNameAndPassword({
              ...userNameAndPassword,
              password: e.target.value
            })
          }
          value={userNameAndPassword.password}
        />

        <button
          onClick={() => {
            if (
              userNameAndPassword.password?.length &&
              userNameAndPassword.userName?.length
            ) {
              const newConfigs = JSON.parse(
                localStorage.getItem(localStorageKey) || "[]"
              ).concat({
                userId: uuidv4(),
                ...userNameAndPassword
              })
              localStorage.setItem(localStorageKey, JSON.stringify(newConfigs))
              setAccountAndConfigs(newConfigs)
              setUserNameAndPassword(defaultValues)
            } else {
              setError(
                "请输入账号密码（please enter userName and Password and Password.）"
              )
            }
          }}>
          提交
        </button>
      </div>
    </Container>
  )
}

const Container = styled.div`
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  display: grid;
  grid-auto-flow: row;
  gap: 20px;
`

const UserItem = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 70px 70px;
  gap: 8px;
`
const LoginButton = styled.button``
export default IndexPopup
