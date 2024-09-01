import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input, Modal, Select, Tag, Tooltip } from "antd"
import { useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/dist/hook"

import { AccountDetailModal } from "~components/AccountDetailModal"
import { DeleteModal } from "~components/DeleteModal"
import { EmptyContent } from "~components/EmptyContent"
import { TitleWithButton } from "~components/TitleWithButton"
import { defaultUserConfigs, envOptions, type AccountItem } from "~constants"
import { useFilterInput } from "~hooks/useFilterInput"
import { useImpersonateAccount } from "~hooks/useImpersonateAccount"
import { StoreNames } from "~utils/indexedDB"

export const ImpersonateConfigs = () => {
  const [newUserConfigs, setNewUserConfigs] = useStorage(
    "impersonateConfigs",
    defaultUserConfigs
  )

  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)

  const { impersonateAccounts, updateImpersonateAccounts } =
    useImpersonateAccount()
  const { filterType, filterValue, filterInput } = useFilterInput({
    disabled: (impersonateAccounts?.length ?? 0) < 1
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [activeAccount, setActiveAccount] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleImpersonate = async (loginConfigs: AccountItem) => {
    await sendToBackground({
      name: "impersonate",
      body: loginConfigs
    })
  }
  const handleCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const filteredAccounts =
    impersonateAccounts?.filter((account) =>
      account?.[filterType?.value ?? ""]
        ?.toLowerCase()
        ?.includes?.(filterValue.toLowerCase())
    ) ?? []

  return (
    <Container>
      <TitleWithButton
        buttonText="Add account"
        title="Impersonate Accounts"
        onClick={() => {
          setIsAddModalOpen(true)
        }}
      />

      {impersonateAccounts?.length ? (
        <>
          {filterInput}
          <Accounts>
            {filteredAccounts.map((currentAccount) => {
              return (
                <Tooltip
                  key={currentAccount.userId}
                  placement="topLeft"
                  title={`${currentAccount.tag || currentAccount.email}`}>
                  <UserItem>
                    <UserName
                      onClick={() => {
                        setIsDetailModalOpen(true)
                        setActiveAccount(currentAccount)
                      }}>
                      {currentAccount.email || currentAccount.tag}
                    </UserName>

                    <Operations>
                      <Select
                        placeholder="Select Env"
                        value={currentAccount.env.value}
                        onChange={(_, env) => {
                          updateImpersonateAccounts(
                            impersonateAccounts.map((item) => {
                              return item.userId === currentAccount.userId
                                ? {
                                    ...item,
                                    env: env as typeof defaultUserConfigs.env
                                  }
                                : item
                            })
                          )
                        }}
                        options={envOptions}
                      />

                      <Button
                        type="primary"
                        onClick={() => {
                          handleImpersonate(currentAccount)
                        }}>
                        Impersonate
                      </Button>
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        size="middle"
                        danger
                        onClick={() => {
                          setRemoveSelectedItem(currentAccount)
                          setIsDeleteModalOpen(true)
                        }}
                      />
                    </Operations>
                  </UserItem>
                </Tooltip>
              )
            })}
            {error ? <ErrorText>{error}</ErrorText> : null}
          </Accounts>
        </>
      ) : (
        <EmptyContent description="No data, please click the button to add an account." />
      )}
      <DeleteModal
        email={removeSelectedItem?.email}
        isDeleteModalOpen={isDeleteModalOpen}
        onOk={() => {
          if (!removeSelectedItem) return
          const filteredConfigs = impersonateAccounts.filter(
            (accountConfig) =>
              accountConfig.userId !== removeSelectedItem.userId
          )
          updateImpersonateAccounts(filteredConfigs)
          setIsDeleteModalOpen(false)
          setRemoveSelectedItem(null)
        }}
        handleCancel={handleCancel}
      />
      <Modal
        title="Add a new account"
        open={isAddModalOpen}
        okText="Submit"
        onOk={() => {
          if (newUserConfigs?.userId?.length && newUserConfigs?.email.length) {
            updateImpersonateAccounts([
              ...impersonateAccounts,
              { ...newUserConfigs, createdAt: new Date().toISOString() }
            ])
            setNewUserConfigs(defaultUserConfigs)
          } else {
            setError("The userId is required")
          }
          setIsAddModalOpen(false)
        }}
        onCancel={() => {
          setIsAddModalOpen(false)
        }}>
        <Form>
          <Input
            type="text"
            placeholder="Please enter Email"
            onChange={(e) =>
              setNewUserConfigs({
                ...newUserConfigs,
                email: e.target.value
              })
            }
            value={newUserConfigs.email}
          />
          <Input
            type="text"
            placeholder="Please enter userId"
            onChange={(e) =>
              setNewUserConfigs({
                ...newUserConfigs,
                userId: e.target.value
              })
            }
            value={newUserConfigs.userId}
          />

          <Input
            type="text"
            placeholder="Please set a tag to help you distinguish the purpose of this account."
            onChange={(e) =>
              setNewUserConfigs({
                ...newUserConfigs,
                tag: e.target.value
              })
            }
            value={newUserConfigs.tag}
          />
        </Form>
      </Modal>
      <AccountDetailModal
        account={activeAccount}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
        }}
      />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
`

const Form = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 8px;
`

const Accounts = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(40px, 1fr));
  grid-gap: 8px;
  height: calc(580px - 190px);
  overflow-y: auto;
`

const UserItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #00000010;
  align-content: center;
  &:hover {
    background: #00000015;
  }
`

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`

const UserName = styled.span`
  display: block;
  align-items: center;
  font-size: 16px;
  overflow: hidden;
  padding-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 120px; /* 根据需要调整宽度 */
`

const Operations = styled.div`
  display: grid;
  grid-template-columns: 145px 120px auto;
  grid-gap: 8px;
  justify-content: flex-end;
`
