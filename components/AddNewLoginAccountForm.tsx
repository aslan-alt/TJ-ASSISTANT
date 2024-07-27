import { Button, Input, Select } from "antd"
import styled from "styled-components"

import { envOptions } from "~constants"

export const AddNewLoginAccountForm = ({
  setNewUserConfigs,
  newUserConfigs
}) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder="Please enter Email"
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            email: e.target.value
          })
        }
        value={newUserConfigs.email}
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
        placeholder="Please set a tag to help you distinguish the purpose of this account."
        onChange={(e) =>
          setNewUserConfigs({
            ...newUserConfigs,
            tag: e.target.value
          })
        }
        value={newUserConfigs.tag}
      />

      <Select
        placeholder="Select Env"
        defaultValue={envOptions[0].value}
        onChange={(_, env) => {
          setNewUserConfigs({
            ...newUserConfigs,
            env
          })
        }}
        options={envOptions}
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
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 8px;
`

const SubmitButton = styled(Button)`
  margin-top: 32px;
`
