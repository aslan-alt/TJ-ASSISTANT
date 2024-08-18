import { DeleteOutlined, InboxOutlined } from "@ant-design/icons"
import {
  Button,
  message,
  Table,
  Tag,
  Typography,
  Upload,
  type TableColumnsType
} from "antd"
import { isEmpty } from "lodash"
import { ExcelRenderer } from "react-excel-renderer"
import styled from "styled-components"

import { envOptions, roleOptions, type AccountItem } from "~constants"
import {
  StoreNames,
  useDeleteAllAccounts,
  useGetAccounts,
  useUpdateAccounts
} from "~utils/indexedDB"

export const Settings = () => {
  const { data: accounts, ...rest } = useGetAccounts()
  const { mutateAsync: updateAccounts } = useUpdateAccounts(StoreNames.All)
  const { mutateAsync: updateLoginAccounts } = useUpdateAccounts(
    StoreNames.Login
  )
  const { mutateAsync: updateImpersonateAccounts } = useUpdateAccounts(
    StoreNames.Impersonate
  )
  const { mutateAsync: deleteAllAccounts } = useDeleteAllAccounts()

  const handleFile = (info) => {
    const { status } = info.file
    if (status !== "uploading") {
      console.log(info.file, info.fileList)
    }
    if (status === "done") {
      ExcelRenderer(info.file?.originFileObj, async (err, resp) => {
        if (err) {
          console.log(err)
        } else {
          const accountsFromExcel: AccountItem[] = resp.rows
            .slice(1)
            .filter((row) => {
              return row?.[0]
            })
            .map((item) => ({
              email: item?.[0],
              password: item?.[1],
              displayName: item?.[2],
              userId: item?.[3],
              teamName: item?.[4],
              tag: item?.[5],
              TeamId: item?.[6],
              notes: item?.[7],
              env: envOptions[0],
              role: roleOptions[0],
              createdAt: new Date().toISOString()
            }))
          try {
            await updateAccounts(accountsFromExcel)
            await updateLoginAccounts(
              accountsFromExcel?.filter(
                (account) => !isEmpty(account?.password)
              )
            )
            await updateImpersonateAccounts(
              accountsFromExcel?.filter((account) => !isEmpty(account?.userId))
            )
            message.success(`${info.file.name} file uploaded successfully.`)
          } catch (error) {
            console.error(error)
          }
        }
      })
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  const columns: TableColumnsType<Partial<AccountItem>> = [
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <a>Delete</a>
    }
  ]

  const datax: AccountItem[] = accounts?.map((item) => ({
    ...item,
    key: item.email
  }))

  return accounts?.length ? (
    <div>
      <Button
        type="primary"
        shape="round"
        danger
        icon={<DeleteOutlined />}
        size="middle"
        onClick={() => {
          deleteAllAccounts()
        }}>
        Clear accounts
      </Button>
      <StyledTable
        className="test"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.notes}</p>
          ),
          rowExpandable: (record) => !!record.notes
        }}
        dataSource={datax}
      />
    </div>
  ) : (
    <SettingContainer>
      <Typography.Title level={4} style={{ margin: "0" }}>
        Import Accounts
      </Typography.Title>
      <Upload.Dragger name="file" height={200} onChange={handleFile}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Upload.Dragger>
      <Typography.Text>
        If you are unsure about the table format, you can contact
        <Tag color="blue">@tg-qa-cn</Tag>
      </Typography.Text>
    </SettingContainer>
  )
}

const StyledTable = styled(Table)`
  .ant-table-pagination-right {
    justify-content: center !important;
  }
`

const SettingContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
`
