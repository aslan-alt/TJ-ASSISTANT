import { Input, Select, Space } from "antd"
import styled from "styled-components"

import { useStorage } from "@plasmohq/storage/dist/hook"

const searchTypes = [
  { value: "email", label: "Search by email" },
  { value: "tag", label: "Search by tag" },
  { value: "notes", label: "Search by notes" }
]

export const SearchInput = ({
  disabled,
  storageKey
}: {
  disabled: boolean
  storageKey: string
}) => {
  const [searchValue, setSearchValue] = useStorage(
    `searchValue-${storageKey}`,
    ""
  )
  const [searchType, setSearchType] = useStorage(
    `searchType-${storageKey}`,
    searchTypes[0]
  )

  const searchInput = (
    <Space.Compact>
      <SearchSelect
        defaultValue={searchType.value}
        options={searchTypes}
        onChange={(_, nweSearchType) => {
          setSearchType(nweSearchType as (typeof searchTypes)[0])
        }}
      />
      <Input
        placeholder="Search by email"
        size="large"
        allowClear
        disabled={disabled}
        onChange={(e) => {
          setSearchValue(e.target.value)
        }}
      />
    </Space.Compact>
  )

  return {
    searchValue,
    searchType,
    searchInput
  }
}

const SearchSelect = styled(Select)`
  height: 100%;
`
