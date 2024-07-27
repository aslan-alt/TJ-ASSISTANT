import styled from "styled-components"

import "./globalStyle.css"

import { LoginConfigs } from "~components/LoginConfigs"
import { TitleWithAddButton } from "~components/TitleWithAddButton"

function IndexPopup() {
  return (
    <Container>
      <LoginConfigs />
      <TitleWithAddButton title="Impersonate" onAddClick={() => {}} />
    </Container>
  )
}

const Container = styled.div`
  width: 500px;
  padding: 24px;
  border-radius: 8px;
  display: grid;
  align-content: flex-start;
`

export default IndexPopup
