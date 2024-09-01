import { Input, Select, Space } from "antd"
import { useState } from "react"
import styled from "styled-components"

const filterTypes = [
  { value: "email", label: "Filter by email" },
  { value: "tag", label: "Filter by tag" },
  { value: "notes", label: "Filter by notes" }
]

export const useFilterInput = ({ disabled }: { disabled: boolean }) => {
  const [filterValue, setFilterValue] = useState<string>("")
  const [filterType, setFilterType] = useState(filterTypes[0])

  const filterInput = (
    <Space.Compact>
      {/* TODO: Add Badge*/}
      <FilterSelect
        value={filterType.value}
        options={filterTypes}
        onChange={(_, nweSearchType) => {
          setFilterType(nweSearchType as (typeof filterTypes)[0])
        }}
      />
      <Input
        value={filterValue}
        placeholder={`Please center the ${filterType?.label?.replace("Search by ", "")}`}
        size="large"
        allowClear
        disabled={disabled}
        onChange={(e) => {
          setFilterValue(e.target.value)
        }}
      />
    </Space.Compact>
  )

  return {
    filterValue,
    filterType,
    filterInput
  }
}

const FilterSelect = styled(Select)`
  height: 100%;
`
