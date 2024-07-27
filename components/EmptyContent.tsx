import { Card, Empty, type EmptyProps } from "antd"
import type { FC } from "react"

export const EmptyContent: FC<EmptyProps> = (props) => {
  return (
    <Card>
      <Empty {...props} />
    </Card>
  )
}
