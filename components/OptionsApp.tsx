import React, { useState } from "react"
import {
  ApiOutlined,
  CalendarOutlined,
  CiCircleOutlined,
  FolderOutlined, OpenAIOutlined,
  UserAddOutlined
} from "@ant-design/icons"
import { Layout, Menu, theme, Typography } from "antd"
import styled from "styled-components"
import { Settings } from "~components/Settings"

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key:'accounts',
    icon: <UserAddOutlined />,
    label:"Login or Impersonate",
  },
  {
    key:'opty',
    icon: <ApiOutlined />,
    label:"Opty flags",
  },
  {
    key:'createDeal',
    icon: <FolderOutlined />,
    label:"Create Folder/Deal",
  },
  {
    key:'oncall',
    icon: <CalendarOutlined />,
    label:"oncall checklist",
  },
  {
    key:'ci',
    icon: <CiCircleOutlined />,
    label:"CI & CTI",
  },
  {
    key:'notepad',
    icon: <CiCircleOutlined />,
    label:"Notepad",
  },
  {
    key:'other',
    icon: <OpenAIOutlined />,
    label:"Other",
  },
]


const StayTuned = ({name,describe}:{name:string,describe:string})=>{
  return <>
    <Typography.Title level={3}>
      {name}-related features are under development, stay tuned
    </Typography.Title>
    <Typography.Text  style={{ margin: "0",fontSize:'16px' }}>
      Preview:{describe}
    </Typography.Text>
  </>
}


const router = {
  [menuItems[0].key]: Settings,
  [menuItems[1].key]: ()=><StayTuned
    name={menuItems[1].label}
    describe="You'll be able to enable or disable Opty through the plugin, eliminating the need to manually input the Opty flag. This will make your development and testing process much easier."
  />,
  [menuItems[2].key]: ()=><StayTuned
    name={menuItems[2].label}
    describe="You can customize various types of Deals, making it easy to create them quickly when needed."
  />,
  [menuItems[3].key]: ()=><StayTuned
    name={menuItems[3].label}
    describe="TODO"
  />

}

const Empty = () => {
  return null
}


const OptionsApp: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedTab,setSelectedTab] = useState(menuItems[0].key);

  const Component = router?.[selectedTab] || Empty;

  return (
    <StyledLayout>
      <Header style={{ display: 'flex', alignItems: 'center',color:'#ffff',fontSize:'16px' }}>
        TJ-ASSISTANT
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedTab as string]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onSelect={(item)=>{
              setSelectedTab(item?.key)
            }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Component />
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

const StyledLayout = styled(Layout)`
    height: 100vh;
`;

export default OptionsApp;