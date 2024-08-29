import { DeleteOutlined, InboxOutlined } from "@ant-design/icons"
import { message, Modal, Table, Tag, Typography, Upload } from "antd"
import { isEmpty } from "lodash"
import { useState } from "react"
import { ExcelRenderer } from "react-excel-renderer"
import styled from "styled-components"

import { TitleWithButton } from "~components/TitleWithButton"
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
  const { mutateAsync: deleteAllLogin } = useDeleteAllAccounts(StoreNames.Login)
  const { mutateAsync: deleteAllImpersonate } = useDeleteAllAccounts(
    StoreNames.Impersonate
  )

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
              role: roleOptions[1],
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

  return accounts?.length ? (
    <div>
      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
        onOk={() => {
          const actions = {
            [StoreNames.All]: deleteAllAccounts,
            [StoreNames.Login]: deleteAllLogin,
            [StoreNames.Impersonate]: deleteAllImpersonate
          }
          deleteAllAccounts()
          deleteAllLogin()
          deleteAllImpersonate()
          setIsDeleteModalOpen(false)
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false)
        }}>
        Are you sure you want to delete your account? This action cannot be
        undone. All your data will be permanently removed. Do you wish to
        proceed?
      </Modal>
      <TitleWithButton
        title="Clear all accounts"
        buttonText="Clear"
        danger
        icon={<DeleteOutlined />}
        onClick={() => {
          setIsDeleteModalOpen(true)
        }}
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

const SettingContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
`
