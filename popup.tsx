import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons"
import { Button, Divider, Input, Modal, Tag, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { AddNewAccount } from "~components/AddNewAccount"
import { defaultUserConfigs, localStorageKeyLogin } from "~constants"

function IndexPopup() {
  const [removeSelectedItem, setRemoveSelectedItem] = useState(null)
  const [newUserConfigs, setNewUserConfigs] = useState(defaultUserConfigs)

  const [error, setError] = useState<string | null>(null)

  const [allUserConfigs, setAllUserConfigs] = useState([])

  useEffect(() => {
    setAllUserConfigs(
      JSON.parse(localStorage.getItem(localStorageKeyLogin) || "[]")
    )
  }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setIsModalOpen(false)
    setRemoveSelectedItem(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleLogin = (loginConfigs: typeof newUserConfigs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "login",
        ...loginConfigs
      })
    })
  }
  return (
    <Container>
      <Typography.Title level={3}>Login</Typography.Title>
      <LoginAccounts>
        {allUserConfigs?.length ? (
          allUserConfigs.map((item) => {
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
                        setIsModalOpen(true)
                      }}
                    />
                  </Operations>
                </UserItem>
              </Tooltip>
            )
          })
        ) : (
          <ErrorText>
            No configuration found. Please fill in the form below to configure.
          </ErrorText>
        )}
      </LoginAccounts>
      <Modal
        title="Delete Account"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        Are you sure you want to delete your account? This action cannot be
        undone. All your data will be permanently removed. Do you wish to
        proceed?
      </Modal>
      <Typography.Title level={5}>Impersonate</Typography.Title>

      {error ? <ErrorText>{error}</ErrorText> : null}
      <AddNewAccount
        setAllUserConfigs={setAllUserConfigs}
        setNewUserConfigs={setNewUserConfigs}
        newUserConfigs={newUserConfigs}
        setError={setError}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 500px;
  padding: 0 24px 24px 24px;
  border-radius: 8px;
  display: grid;
  grid-auto-flow: row;
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
const LoginAccounts = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`
const Operations = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  justify-content: flex-end;
`

export default IndexPopup
