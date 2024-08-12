import styled from "styled-components"

import "./globalStyle.css"

import {Tabs} from "antd"

import { ImpersonateConfigs } from "~components/ImpersonateConfigs"
import { LoginConfigs } from "~components/LoginConfigs"
import {Settings} from "~components/Settings";


function IndexPopup() {


  return (
    <Container>
        <Tabs
            defaultActiveKey="1"
            size="small"
            style={{ marginBottom: 32 }}
            items={[
                {
                    label: `Login`,
                    key: '0',
                    children: <LoginConfigs />,
                },
                {
                    label: `Impersonate`,
                    key: '1',
                    children:<ImpersonateConfigs />,
                },
                {
                    label: `Settings`,
                    key: '2',
                    children: <Settings />,
                }
            ]}
        />


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
