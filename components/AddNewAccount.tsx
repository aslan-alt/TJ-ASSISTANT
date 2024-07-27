import { Button, Input } from "antd"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"

import { defaultUserConfigs, localStorageKeyLogin } from "~constants"

export const AddNewAccount = ({
  setNewUserConfigs,
  newUserConfigs,
  setAllUserConfigs,
  setError
}) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder="Please set a tag to help you distinguish the purpose of this account."
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            tag: e.target.value
          })
        }
        value={newUserConfigs.tag}
      />
      <Input
        type="text"
        placeholder="Please enter username"
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            userName: e.target.value
          })
        }
        value={newUserConfigs.userName}
      />
      <Input
        type="text"
        placeholder="Please enter password"
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            password: e.target.value
          })
        }
        value={newUserConfigs.password}
      />
      <Input
        type="text"
        placeholder="Please enter url of website"
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            webUrl: e.target.value
          })
        }
        value={newUserConfigs.webUrl}
      />
      <Input
        type="text"
        placeholder="Please enter role"
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            role: e.target.value
          })
        }
        value={newUserConfigs.role}
      />
      <Button
        type="primary"
        onClick={() => {
          if (
            newUserConfigs.password?.length &&
            newUserConfigs.userName?.length &&
            newUserConfigs?.webUrl
          ) {
            const newConfigs = JSON.parse(
              localStorage.getItem(localStorageKeyLogin) || "[]"
            ).concat({
              userId: uuidv4(),
              ...newUserConfigs
            })
            localStorage.setItem(
              localStorageKeyLogin,
              JSON.stringify(newConfigs)
            )
            setAllUserConfigs(newConfigs)
            setNewUserConfigs(defaultUserConfigs)
          } else {
            setError("The userName password webUrl are required")
          }
        }}>
        Save to localStorage
      </Button>
    </Container>
  )
}
const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 8px;
`
