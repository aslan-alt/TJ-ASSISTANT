import { Tooltip } from "antd"
import type { ReactNode } from "react"
import styled from "styled-components"

export const ConfigItem = ({
  title,
  onLabelClick,
  label,
  children,
  titleWidth,
  ...rest
}: {
  title: string
  onLabelClick: () => void
  label: ReactNode
  children?: ReactNode
  titleWidth?: string
}) => {
  return (
    <Tooltip placement="topLeft" title={title}>
      <Container {...rest} $titleWidth={titleWidth}>
        <Label $titleWidth={titleWidth} onClick={onLabelClick}>
          {label}
        </Label>
        {children}
      </Container>
    </Tooltip>
  )
}

const Container = styled.div<{ $titleWidth: string }>`
  display: grid;
  ${({ $titleWidth }) => {
    return `grid-template-columns: ${$titleWidth ? `${$titleWidth} 1fr` : ""}`
  }};
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #00000010;
  align-content: center;
  align-items: center;
  &:hover {
    background: #00000015;
  }
`

const Label = styled.span<{ $titleWidth: string }>`
  display: block;
  align-items: center;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ $titleWidth }) => {
    return `width: ${$titleWidth ? $titleWidth : ""}`
  }};
`
