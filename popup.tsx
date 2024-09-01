import styled from "styled-components"

import "./globalStyle.css"

import { SettingOutlined } from "@ant-design/icons"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button, Tabs, theme } from "antd"

import { useStorage } from "@plasmohq/storage/dist/hook"

import { ImpersonateConfigs } from "~components/ImpersonateConfigs"
import { LoginConfigs } from "~components/LoginConfigs"

const queryClient = new QueryClient()

function IndexPopup() {
  const [selectedTab, setSelectedTab] = useStorage("selectedTab", "0")

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <StyledTabs
          activeKey={selectedTab}
          size="small"
          style={{ marginBottom: 32 }}
          items={[
            {
              label: `Login`,
              key: "0",
              children: <LoginConfigs />
            },
            {
              label: `Impersonate`,
              key: "1",
              children: <ImpersonateConfigs />
            }
          ]}
          onChange={setSelectedTab}
        />
        <StyledButton>
          <Button
            type="primary"
            shape="round"
            icon={<SettingOutlined />}
            style={{ background: "linear-gradient(135deg, #6253E1, #04BEFE)" }}
            size="middle"
            onClick={() => {
              chrome?.runtime?.openOptionsPage?.()
            }}>
            Go to Settings
          </Button>
        </StyledButton>
      </Container>
    </QueryClientProvider>
  )
}

const Container = styled.div`
  width: 580px;
  height: 600px;
  padding: 16px 24px 24px 24px;
  border-radius: 8px;
  display: grid;
  align-content: flex-start;
`

const StyledTabs = styled(Tabs)`
  margin-bottom: 0 !important;
`
const StyledButton = styled.div`
  display: grid;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
`

export default IndexPopup
