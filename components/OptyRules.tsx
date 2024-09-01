import { PlusOutlined } from "@ant-design/icons"
import { Button, Divider, Input, Select, Space, type InputRef } from "antd"
import { useRef } from "react"
import styled from "styled-components"

export const OptyRules = ({
  rules,
  updateRules
}: {
  rules: string[]
  updateRules: (v: string[]) => void
}) => {
  const inputRef = useRef<InputRef>(null)

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault()
    if (inputRef.current?.input?.value?.length) {
      updateRules([...rules, inputRef.current?.input?.value])
    }
  }
  return (
    <Select
      placeholder="custom dropdown render"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <UrlInputAndAddButton>
            <Input
              placeholder="Please enter url"
              ref={inputRef}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add url
            </Button>
          </UrlInputAndAddButton>
        </>
      )}
      options={rules.map((item) => ({ label: item, value: item }))}
    />
  )
}

const UrlInputAndAddButton = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-gap: 8px;
`
