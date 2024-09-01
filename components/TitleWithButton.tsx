import { PlusOutlined } from "@ant-design/icons"
import { Button, Typography, type ButtonProps } from "antd"
import type { FC } from "react"
import styled from "styled-components"

type Props = Pick<
  ButtonProps,
  "shape" | "title" | "onClick" | "icon" | "danger" | "type"
> & {
  buttonText: string
}

export const TitleWithButton: FC<Props> = ({
  onClick,
  title,
  icon = <PlusOutlined />,
  danger = false,
  type = "primary",
  shape = "round",
  buttonText
}) => {
  return (
    <Container>
      <Title level={3}>{title}</Title>
      <Button
        type={type}
        shape={shape}
        danger={danger}
        style={
          danger
            ? {}
            : { background: "linear-gradient(135deg, #6253E1, #04BEFE)" }
        }
        icon={icon}
        size="middle"
        onClick={onClick}>
        {buttonText}
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
`

const Title = styled(Typography.Title)`
  margin: 0 !important;
`
