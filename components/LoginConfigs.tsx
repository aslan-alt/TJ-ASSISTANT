import { DeleteOutlined } from "@ant-design/icons"
import { Button, Modal, Select, Tooltip } from "antd"
import { useState} from "react"
import styled from "styled-components"
import { useStorage } from "@plasmohq/storage/hook"

import { AddNewLoginAccountForm } from "~components/AddNewLoginAccountForm"
import { EmptyContent } from "~components/EmptyContent"
import { TitleWithAddButton } from "~components/TitleWithAddButton"
import {
    type AccountItem,
    defaultUserConfigs,
    envOptions,
    roleOptions
} from "~constants"
import {sendToBackground} from "@plasmohq/messaging";

import {useGetLoginAccount} from "~hooks/useGetLoginAccount";

export const LoginConfigs = () => {
  const [newAccountItem, setNewUserConfigs] = useStorage(
      "addNewUserConfig",
      defaultUserConfigs
  )

  const {loginAccounts,updateLoginAccount} = useGetLoginAccount()

  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [error, setError] = useState<string | null>(null)


  const handleLogin = async (loginConfigs: AccountItem) => {
    // TODO: No need refresh the page if isSameOrigin(currentTab.url, loginConfigs.env.value)
    const homeRes = await sendToBackground({
      name:'goToHome',
      body:loginConfigs
    })
    if(homeRes?.tabId){
      chrome.tabs.sendMessage(homeRes.tabId, {
        action: "login",
        ...loginConfigs
      });
    }


  }
  const handleCancel = () => {
    setIsDeleteModalOpen(false)
  }

  return (
    <Container>
      <TitleWithAddButton
        title="Users list for login"
        onAddClick={() => {
          setIsAddModalOpen(true)
        }}
      />

      {loginAccounts?.length ? (
        <LoginAccounts>
          {loginAccounts.map((currentAccount) => {
            return (
              <Tooltip
                key={currentAccount.email}
                placement="topLeft"
                title={`${currentAccount.tag || currentAccount.email}`}>
                <UserItem>
                  <UserName>{currentAccount.email}</UserName>

                  <Operations>
                    <Select
                      placeholder="Select Env"
                      value={currentAccount?.env?.value}
                      onChange={(_, env) => {
                          updateLoginAccount(
                              loginAccounts?.map((item) => {
                            return item.email === currentAccount.email
                              ? {
                                  ...item,
                                    env: env as typeof envOptions[0]
                                }
                              : item
                          })
                        )
                      }}
                      options={envOptions}
                    />
                    <Select
                      placeholder="Select Role"
                      value={currentAccount?.role?.value}
                      onChange={(_, role) => {
                          updateLoginAccount(
                          loginAccounts.map((item) => {
                            return item.email === currentAccount.email
                              ? {
                                  ...item,
                                  role: role as typeof defaultUserConfigs.role
                                }
                              : item
                          })
                        )
                      }}
                      options={roleOptions}
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
                </UserItem>
              </Tooltip>
            )
          })}
          {error ? <ErrorText>{error}</ErrorText> : null}
        </LoginAccounts>
      ) : (
        <EmptyContent description="No data, please click the button to add an account." />
      )}
      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
        onOk={() => {
          if (!removeSelectedItem) return
          const filteredConfigs = loginAccounts.filter(
              (accountConfig) => accountConfig.email !== removeSelectedItem.email
          )
          updateLoginAccount(filteredConfigs)
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
          if (newAccountItem.password?.length && newAccountItem.email?.length) {
            updateLoginAccount([...loginAccounts, newAccountItem])
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
  height: 200px;
  overflow-y: auto;
  padding: 24px 0;
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

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`

const Operations = styled.div`
  display: grid;
  grid-template-columns: 100px 145px 60px auto;
  grid-gap: 8px;
  justify-content: flex-end;
`
