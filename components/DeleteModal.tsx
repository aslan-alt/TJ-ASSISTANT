import { Modal, Tag } from "antd"
import styled from "styled-components"

export const DeleteModal = ({
  isDeleteModalOpen,
  handleCancel,
  onOk,
  email
}) => {
  return (
    <Modal
      title={
        <Title>
          Delete Account:
          {email ? <Tag color="blue">{email}</Tag> : null}
        </Title>
      }
      open={isDeleteModalOpen}
      onOk={onOk}
      onCancel={handleCancel}>
      Are you sure you want to delete your account? This action cannot be
      undone. All your data will be permanently removed. Do you wish to proceed?
    </Modal>
  )
}

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
