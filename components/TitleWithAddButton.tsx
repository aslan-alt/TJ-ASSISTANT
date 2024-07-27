import { PlusOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
import styled from "styled-components"

export const TitleWithAddButton = ({ onAddClick, title }) => {
  return (
    <Container>
      <Title level={3}>{title}</Title>
      <Button
        type="primary"
        shape="round"
        style={{ background: "linear-gradient(135deg, #6253E1, #04BEFE)" }}
        icon={<PlusOutlined />}
        size="middle"
        onClick={onAddClick}>
        Add account
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`

const Title = styled(Typography.Title)`
  margin: 0 !important;
`
