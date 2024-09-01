import { Switch } from "antd"
import React, { useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"

import { ConfigItem } from "~components/ConfigItem"
import { OptyRules } from "~components/OptyRules"

type OptyItem = {
  flagKey: string
  checked?: boolean
  rules: string[]
}

export const Opty = () => {
  const [optyFlags, setOptyFlags] = useState<OptyItem[]>([
    {
      flagKey: "opty_bt_cross_sharing",
      checked: false,
      rules: ["https://beta.compass.com/app/lab/2898736/commission"]
    },
    {
      flagKey: "bt_cross_sharing_ccibt",
      checked: false,
      rules: ["https://beta.compass.com/app/lab/2898736/commission"]
    }
  ])

  const createOptyFlags = (newflagItem: OptyItem) => {
    return optyFlags.map((item) => {
      if (newflagItem.flagKey === item.flagKey) {
        return newflagItem
      }
      return item
    })
  }

  return (
    <Container>
      {optyFlags?.map((flagItem) => {
        return (
          <OptyItem key={flagItem.flagKey}>
            <OptyKeyAndSwitch
              title={flagItem.flagKey}
              label={flagItem.flagKey}
              onLabelClick={() => {}}>
              <div>
                <Switch
                  checked={flagItem.checked}
                  onChange={() => {
                    sendToBackground({
                      name: "opty",
                      body: flagItem
                    })
                    setOptyFlags(
                      createOptyFlags({
                        ...flagItem,
                        checked: !flagItem.checked
                      })
                    )
                  }}
                />
              </div>
            </OptyKeyAndSwitch>
            <OptyRules
              rules={flagItem.rules}
              updateRules={(rules) => {
                setOptyFlags(createOptyFlags({ ...flagItem, rules }))
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

const OptyKeyAndSwitch = styled(ConfigItem)`
  border: none;
  padding: 0;
  grid-template-columns: 1fr 45px;
  &:hover {
    border: none;
    background: transparent;
  }
`

const OptyItem = styled.div`
  display: grid;
  grid-auto-flow: row;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #00000010;
  align-content: center;
  align-items: center;
  grid-gap: 8px;
  &:hover {
    background: #00000015;
  }
`
