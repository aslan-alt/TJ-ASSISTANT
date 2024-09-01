import { Modal, Typography } from "antd"
import styled from "styled-components"

const { Paragraph, Text, Title } = Typography

export const AccountDetailModal = ({ isOpen, onClose, account }) => {
  if (!account) return

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <DetailItem value={account?.email} label="email:" />
      {account?.userId ? (
        <DetailItem value={account?.userId} label="userId:" />
      ) : null}
      {account?.password ? (
        <DetailItem value={account?.password} label="password:" />
      ) : null}
      {account?.tag ? <DetailItem value={account?.tag} label="tag:" /> : null}
      {account?.notes ? (
        <DetailItem value={account?.notes} label="notes:" />
      ) : null}
    </Modal>
  )
}

const DetailItem = ({ value, label }) => {
  return (
    <ItemContainer>
      <Title level={5}>{label ?? "N/A"}</Title>
      <Paragraph copyable>{value}</Paragraph>
    </ItemContainer>
  )
}

const ItemContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  justify-content: flex-start;
`
