import styled from "styled-components"

import "./globalStyle.css"

import {Tabs} from "antd"

import { ImpersonateConfigs } from "~components/ImpersonateConfigs"
import { LoginConfigs } from "~components/LoginConfigs"
import {Settings} from "~components/Settings";
import {useStorage} from "@plasmohq/storage/dist/hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient()

function IndexPopup() {
    const [selectedTab, setSelectedTab] = useStorage(
        "selectedTab",
        '0'
    )

  return (
      <QueryClientProvider client={queryClient}>
          <Container>
              <Tabs
                  activeKey={selectedTab}
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
                  ]}
                  onChange={setSelectedTab}
              />
          </Container>
      </QueryClientProvider>

  )
}

const Container = styled.div`
  width: 500px;
    height: 548px;
  padding: 24px;
  border-radius: 8px;
  display: grid;
  align-content: flex-start;
  grid-gap: 24px;
`

export default IndexPopup
