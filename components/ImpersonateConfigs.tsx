import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input, Modal, Select, Tooltip } from "antd"
import { useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/dist/hook"

import { EmptyContent } from "~components/EmptyContent"
import { TitleWithButton } from "~components/TitleWithButton"
import { defaultUserConfigs, envOptions, type AccountItem } from "~constants"
import { useImpersonateAccount } from "~hooks/useImpersonateAccount"
import { useSearchInput } from "~hooks/useSearchInput"
import { getChromeCurrentTab } from "~utils/chromeMethods"
import { StoreNames } from "~utils/indexedDB"

export const ImpersonateConfigs = () => {
  const [newUserConfigs, setNewUserConfigs] = useStorage(
    "impersonateConfigs",
    defaultUserConfigs
  )

  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)

  const { impersonateAccounts, updateImpersonateAccounts } =
    useImpersonateAccount()
  const { searchType, searchValue, searchInput } = useSearchInput({
    disabled: (impersonateAccounts?.length ?? 0) < 1,
    storageKey: StoreNames.Impersonate
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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
      account?.[searchType?.value ?? ""]
        ?.toLowerCase()
        ?.includes?.(searchValue.toLowerCase())
    ) ?? []

  return (
    <Container>
      <TitleWithButton
        buttonText="Add account"
        title="Impersonate"
        onClick={() => {
          setIsAddModalOpen(true)
        }}
      />

      {impersonateAccounts?.length ? (
        <>
          {searchInput}
          <LoginAccounts>
            {filteredAccounts.map((loginAccount) => {
              return (
                <Tooltip
                  key={loginAccount.userId}
                  placement="topLeft"
                  title={`${loginAccount.tag || loginAccount.email}`}>
                  <UserItem>
                    <UserName>
                      {loginAccount.tag || loginAccount.email}
                    </UserName>

                    <Operations>
                      <Select
                        placeholder="Select Env"
                        value={loginAccount.env.value}
                        onChange={(_, env) => {
                          updateImpersonateAccounts(
                            impersonateAccounts.map((item) => {
                              return item.userId === loginAccount.userId
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
                          handleImpersonate(loginAccount)
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
                          setRemoveSelectedItem(loginAccount)
                          setIsDeleteModalOpen(true)
                        }}
                      />
                    </Operations>
                  </UserItem>
                </Tooltip>
              )
            })}
            {error ? <ErrorText>{error}</ErrorText> : null}
          </LoginAccounts>
        </>
      ) : (
        <EmptyContent description="No data, please click the button to add an account." />
      )}
      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
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
        onCancel={handleCancel}>
        Are you sure you want to delete your account? This action cannot be
        undone. All your data will be permanently removed. Do you wish to
        proceed?
      </Modal>
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
            value={newUserConfigs.userId}
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

const LoginAccounts = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(40px, 1fr));
  grid-gap: 8px;
  height: calc(548px - 140px);
  overflow-y: auto;
`

const UserItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
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
  width: 80px; /* 根据需要调整宽度 */
`

const Operations = styled.div`
  display: grid;
  grid-template-columns: 145px 120px auto;
  grid-gap: 8px;
  justify-content: flex-end;
`
