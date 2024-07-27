import { DeleteOutlined } from "@ant-design/icons"
import { Button, Modal, Tooltip } from "antd"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { AddNewLoginAccountForm } from "~components/AddNewLoginAccountForm"
import { EmptyContent } from "~components/EmptyContent"
import { TitleWithAddButton } from "~components/TitleWithAddButton"
import { defaultUserConfigs, localStorageKeyLogin } from "~constants"

export const LoginConfigs = () => {
  const [allUserConfigs, setAllUserConfigs] = useState([])
  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)
  const [newUserConfigs, setNewUserConfigs] = useState(defaultUserConfigs)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleOk = () => {
    if (!removeSelectedItem) return
    const filteredConfigs = allUserConfigs.filter(
      (accountConfig) => accountConfig.userId !== removeSelectedItem.userId
    )
    localStorage.setItem(
      localStorageKeyLogin,
      JSON.stringify(filteredConfigs || "[]")
    )
    setAllUserConfigs(filteredConfigs)
    setIsDeleteModalOpen(false)
    setRemoveSelectedItem(null)
  }

  const handleLogin = (loginConfigs: typeof newUserConfigs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "login",
        ...loginConfigs
      })
    })
  }
  const handleCancel = () => {
    setIsDeleteModalOpen(false)
  }

  useEffect(() => {
    setAllUserConfigs(
      JSON.parse(localStorage.getItem(localStorageKeyLogin) || "[]")
    )
  }, [])

  return (
    <Container>
      <TitleWithAddButton
        title="Users list for login"
        onAddClick={() => {
          setIsAddModalOpen(true)
        }}
      />
      {allUserConfigs?.length ? (
        <LoginAccounts>
          {allUserConfigs.map((item) => {
            return (
              <Tooltip id={item.userId} placement="topLeft" title={item.tag}>
                <UserItem>
                  <UserName>{item.userName}</UserName>

                  <Operations>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleLogin(item)
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
                        setRemoveSelectedItem(item)
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
        onOk={handleOk}
        onCancel={handleCancel}>
        Are you sure you want to delete your account? This action cannot be
        undone. All your data will be permanently removed. Do you wish to
        proceed?
      </Modal>
      <Modal
        title="Add a new account"
        open={isAddModalOpen}
        onOk={() => {
          setIsAddModalOpen(false)
        }}
        onCancel={() => {
          setIsAddModalOpen(false)
        }}>
        <AddNewLoginAccountForm
          setAllUserConfigs={setAllUserConfigs}
          setNewUserConfigs={setNewUserConfigs}
          newUserConfigs={newUserConfigs}
          setError={setError}
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
  grid-auto-flow: row;
  grid-gap: 8px;
  height: 200px;
  overflow-y: auto;
`

const UserItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #00000015;
  }
`

const UserName = styled.span`
  display: grid;
  align-items: center;
  font-size: 16px;
  overflow: hidden;
`

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`

const Operations = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  justify-content: flex-end;
`
