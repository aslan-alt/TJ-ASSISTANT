import { DeleteOutlined } from "@ant-design/icons"
import { Button, Modal, Select } from "antd"
import { useState } from "react"
import styled from "styled-components"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { AccountDetailModal } from "~components/AccountDetailModal"
import { AddNewLoginAccountForm } from "~components/AddNewLoginAccountForm"
import { ConfigItem } from "~components/ConfigItem"
import { DeleteModal } from "~components/DeleteModal"
import { EmptyContent } from "~components/EmptyContent"
import { TitleWithButton } from "~components/TitleWithButton"
import { defaultUserConfigs, envOptions, type AccountItem } from "~constants"
import { useFilterInput } from "~hooks/useFilterInput"
import { useGetLoginAccount } from "~hooks/useGetLoginAccount"

export const LoginConfigs = () => {
  // All accounts
  const { loginAccounts, updateLoginAccount } = useGetLoginAccount()

  // Add account
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAccountItem, setNewUserConfigs] = useStorage(
    "addNewUserConfig",
    defaultUserConfigs
  )

  // Delete account
  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // details account
  const [activeAccount, setActiveAccount] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Filter accounts
  const { filterType, filterValue, filterInput } = useFilterInput({
    disabled: (loginAccounts?.length ?? 0) < 1
  })
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (loginConfigs: AccountItem) => {
    await sendToBackground({
      name: "login",
      body: loginConfigs
    })
  }
  const handleCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const filteredAccounts =
    loginAccounts?.filter((account) =>
      account?.[filterType?.value ?? ""]
        ?.toLowerCase()
        ?.includes?.(filterValue.toLowerCase())
    ) ?? []

  return (
    <Container>
      <TitleWithButton
        buttonText="Add account"
        title="Login Accounts"
        onClick={() => {
          setIsAddModalOpen(true)
        }}
      />

      {loginAccounts?.length ? (
        <>
          {filterInput}
          <LoginAccounts>
            {filteredAccounts.map((currentAccount) => {
              return (
                <ConfigItem
                  key={currentAccount.email}
                  onLabelClick={() => {
                    setIsDetailModalOpen(true)
                    setActiveAccount(currentAccount)
                  }}
                  label={currentAccount.email}
                  title={`${currentAccount.tag || currentAccount.email}`}
                  titleWidth="246px">
                  <Operations>
                    <Select
                      placeholder="Select Env"
                      options={envOptions}
                      value={currentAccount?.env?.value}
                      onChange={(_, env) => {
                        updateLoginAccount(
                          loginAccounts?.map((item) => {
                            if (item.email === currentAccount.email) {
                              return {
                                ...item,
                                env: env as (typeof envOptions)[0]
                              }
                            }
                            return item
                          })
                        )
                      }}
                    />

                    <Button
                      type="primary"
                      onClick={() => {
                        handleLogin(currentAccount)
                      }}>
                      Login
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
                </ConfigItem>
              )
            })}
            {error ? <ErrorText>{error}</ErrorText> : null}
          </LoginAccounts>
        </>
      ) : (
        <EmptyContent description="No data, please click the button to add an account." />
      )}
      <DeleteModal
        email={removeSelectedItem?.email}
        isDeleteModalOpen={isDeleteModalOpen}
        onOk={() => {
          if (!removeSelectedItem) return
          const filteredConfigs = loginAccounts.filter(
            (accountConfig) => accountConfig.email !== removeSelectedItem.email
          )
          updateLoginAccount(filteredConfigs)
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
          if (newAccountItem.password?.length && newAccountItem.email?.length) {
            updateLoginAccount([
              ...loginAccounts,
              { ...newAccountItem, createdAt: new Date().toISOString() }
            ])
            setNewUserConfigs(defaultUserConfigs)
          } else {
            setError("The email and password are required")
          }
          setIsAddModalOpen(false)
        }}
        onCancel={() => {
          setIsAddModalOpen(false)
        }}>
        <AddNewLoginAccountForm
          setNewUserConfigs={setNewUserConfigs}
          newUserConfigs={newAccountItem}
        />
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

const LoginAccounts = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(40px, 1fr));
  grid-gap: 8px;
  height: calc(580px - 190px);
  overflow-y: auto;
`

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`

const Operations = styled.div`
  display: grid;
  grid-template-columns: 100px 60px auto;
  grid-gap: 8px;
  justify-content: flex-end;
`
