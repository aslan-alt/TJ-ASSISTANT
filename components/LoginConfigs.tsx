import { DeleteOutlined } from "@ant-design/icons"
import { Button, Modal, Select, Tooltip } from "antd"
import {useEffect, useState} from "react"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"
import {isEmpty} from "lodash"
import { useStorage } from "@plasmohq/storage/hook"

import { AddNewLoginAccountForm } from "~components/AddNewLoginAccountForm"
import { EmptyContent } from "~components/EmptyContent"
import { TitleWithAddButton } from "~components/TitleWithAddButton"
import {
  defaultUserConfigs,
  envOptions,
  roleOptions
} from "~constants"
import {sendToBackground} from "@plasmohq/messaging";
import {useGetAccounts} from "~utils/indexedDB";
import type {AccountItem} from "~components/Settings";

export const LoginConfigs = () => {
  const [newAccountItem, setNewUserConfigs] = useStorage(
      "addNewUserConfig",
      defaultUserConfigs
  )

  const [userAccountsForLogin, setUserAccountsForLogin] = useState<
    (typeof defaultUserConfigs)[]
  >([])

  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [error, setError] = useState<string | null>(null)


  const handleLogin = async (loginConfigs: typeof newAccountItem) => {
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

  // useEffect(()=>{
  //   getAccounts().then(res=>{
  //
  //     setUserAccountsForLogin((state)=>{
  //       const accountFromExcel = (res as AccountItem[]).filter(item=>!isEmpty(item.password)).map(item=>({
  //         email: item.email,
  //         password: item.password,
  //         tag:`${item?.role??''} (${item.displayName??'N/A'})`,
  //         env: envOptions[0] as typeof defaultUserConfigs.env,
  //         role: roleOptions[1] as typeof defaultUserConfigs.role,
  //       }));
  //
  //       return [...state,...accountFromExcel]
  //     });
  //   })
  // },[])

  return (
    <Container>
      <TitleWithAddButton
        title="Users list for login"
        onAddClick={() => {
          setIsAddModalOpen(true)
        }}
      />

      {userAccountsForLogin?.length ? (
        <LoginAccounts>
          {userAccountsForLogin.map((loginAccount) => {
            return (
              <Tooltip
                key={loginAccount.email}
                placement="topLeft"
                title={`${loginAccount.tag || loginAccount.email}`}>
                <UserItem>
                  <UserName>{loginAccount.email}</UserName>

                  <Operations>
                    <Select
                      placeholder="Select Env"
                      value={loginAccount.env.value}
                      onChange={(_, env) => {
                        setUserAccountsForLogin(
                          userAccountsForLogin.map((item) => {
                            return item.email === loginAccount.email
                              ? {
                                  ...item,
                                  env: env as typeof defaultUserConfigs.role
                                }
                              : item
                          })
                        )
                      }}
                      options={envOptions}
                    />
                    <Select
                      placeholder="Select Role"
                      value={loginAccount?.role?.value}
                      onChange={(_, role) => {
                        setUserAccountsForLogin(
                          userAccountsForLogin.map((item) => {
                            return item.email === loginAccount.email
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
                        handleLogin(loginAccount)
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
      ) : (
        <EmptyContent description="No data, please click the button to add an account." />
      )}
      <Modal
        title="Delete Account"
        open={isDeleteModalOpen}
        onOk={() => {
          if (!removeSelectedItem) return
          const filteredConfigs = userAccountsForLogin.filter(
              (accountConfig) => accountConfig.email !== removeSelectedItem.email
          )
          setUserAccountsForLogin(filteredConfigs)
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
            setUserAccountsForLogin([...userAccountsForLogin, newAccountItem])
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
