import { Input, Select, Space } from "antd"
import { useState } from "react"
import styled from "styled-components"

import { useStorage } from "@plasmohq/storage/dist/hook"

const searchTypes = [
  { value: "email", label: "Search by email" },
  { value: "tag", label: "Search by tag" },
  { value: "notes", label: "Search by notes" }
]

export const useSearchInput = ({
  disabled,
  storageKey
}: {
  disabled: boolean
  storageKey: string
}) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [searchType, setSearchType] = useState(searchTypes[0])

  const searchInput = (
    <Space.Compact>
      <SearchSelect
        value={searchType.value}
        options={searchTypes}
        onChange={(_, nweSearchType) => {
          setSearchType(nweSearchType as (typeof searchTypes)[0])
        }}
      />
      <Input
        value={searchValue}
        placeholder={`Please center the ${searchType?.label?.replace("Search by ", "")}`}
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
