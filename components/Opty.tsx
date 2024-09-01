import { Switch } from "antd"
import { useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"

type OptyItem = {
  flagKey: string
  checked?: boolean
}

export const Opty = () => {
  const [optyFlags, setOptyFlags] = useState<OptyItem[]>([
    { flagKey: "opty_bt_cross_sharing", checked: false },
    { flagKey: "bt_cross_sharing_ccibt", checked: false }
  ])

  return (
    <Container>
      {optyFlags?.map((flagItem) => {
        return (
          <OptyItem key={flagItem.flagKey}>
            {flagItem.flagKey}
            <Switch
              checked={flagItem.checked}
              onChange={() => {
                sendToBackground({
                  name: "opty",
                  body: flagItem
                })
                setOptyFlags(
                  optyFlags.map((item) => {
                    if (flagItem.flagKey === item.flagKey) {
                      return {
                        ...item,
                        checked: !item?.checked
                      }
                    }
                    return item
                  })
                )
              }}
            />
          </OptyItem>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
`

const OptyItem = styled.div`
  display: grid;
  grid-template-columns: 120px 40px;
  grid-gap: 12px;
`
