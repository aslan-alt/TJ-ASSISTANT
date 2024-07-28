import styled from "styled-components"

import "./globalStyle.css"

import { Divider } from "antd"

import { ImpersonateConfigs } from "~components/ImpersonateConfigs"
import { LoginConfigs } from "~components/LoginConfigs"

function IndexPopup() {
  return (
    <Container>
      <LoginConfigs />
      <Divider style={{ margin: 0 }} />
      <ImpersonateConfigs />
    </Container>
  )
}

const Container = styled.div`
  width: 500px;
  padding: 24px;
  border-radius: 8px;
  display: grid;
  align-content: flex-start;
  grid-gap: 24px;
`

export default IndexPopup
