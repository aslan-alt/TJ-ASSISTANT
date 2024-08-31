import { Settings } from "~components/Settings"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import styled from "styled-components"
import "./globalStyle.css"
import { Typography } from "antd"

const queryClient = new QueryClient()

function OptionsIndex() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Title level={2}>
          TJ-Assistant Configuration
        </Title>
        <Settings />
      </Container>
    </QueryClientProvider>
  )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: minmax(500px, max-content);
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-content: flex-start;
    padding-top: 20px;
`;

const Title = styled(Typography.Title)`
    display: flex;
    justify-content: center;
    margin-bottom:16px;
`;

export default OptionsIndex