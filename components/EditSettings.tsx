import { Button, Modal, Typography } from "antd"
import { StoreNames, useDeleteAllAccounts } from "~utils/indexedDB"
import { DeleteOutlined } from "@ant-design/icons"
import { useState } from "react"
import styled from "styled-components"

export const EditSettings = ()=>{
  const { mutateAsync: deleteAllAccounts } = useDeleteAllAccounts()
  const { mutateAsync: deleteAllLogin } = useDeleteAllAccounts(StoreNames.Login)
  const { mutateAsync: deleteAllImpersonate } = useDeleteAllAccounts(
    StoreNames.Impersonate
  )

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<StoreNames>()

  return <>
    <Modal
      title="Delete Account"
      open={isDeleteModalOpen}
      onOk={() => {

        if(deleteType === StoreNames.All){
          deleteAllAccounts()
          deleteAllLogin()
          deleteAllImpersonate()
        }else {
          const actions = {
            [StoreNames.Login]: deleteAllLogin,
            [StoreNames.Impersonate]: deleteAllImpersonate
          }
          actions?.[deleteType]?.()
        }

        setDeleteType(undefined)
        setIsDeleteModalOpen(false)
      }}
      onCancel={() => {
        setDeleteType(undefined)
        setIsDeleteModalOpen(false)
      }}>
      Are you sure you want to delete your account? This action cannot be
      undone. All your data will be permanently removed. Do you wish to
      proceed?
    </Modal>
    {
      [
        {
          type: StoreNames.All,
          title: "Clear all accounts"
        },
        {
          type: StoreNames.Login,
          title: "Clear login accounts"
        },
        {
          type: StoreNames.Impersonate,
          title: "Clear impersonation accounts"
        }
      ].map(item=>{
        return (
          <ConfigItem key={item.type}>
            <Typography.Text  style={{ margin: "0" }}>
              {item.title}
            </Typography.Text>

            <Button
              type="primary"
              shape="round"
              danger
              icon={<DeleteOutlined />}
              size="middle"
              onClick={() => {
                setIsDeleteModalOpen(true)
                setDeleteType(item.type)
              }}>
              Clear
            </Button>
          </ConfigItem>
        )
      })
    }
  </>
}

const ConfigItem = styled.div`
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #e4e4e4;
`;