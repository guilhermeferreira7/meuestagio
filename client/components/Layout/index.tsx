import { Layout, Menu, Space, theme } from "antd";
import {
  LoginOutlined,
  HomeOutlined,
  UserAddOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React, { ReactNode, useState } from "react";

import styles from "./styles.module.css";

interface PageLayoutProps {
  children: ReactNode;
}

const { useToken } = theme;
const { Sider, Header, Content, Footer } = Layout;

export default function PageLayout({ children }: PageLayoutProps) {
  const { token } = useToken();

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      label: <Link href="/">Inicio</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link href="/login">Login</Link>,
      key: "login",
      icon: <LoginOutlined />,
    },
    {
      label: <Link href="/create-account">Criar conta</Link>,
      key: "createAccount",
      icon: <UserAddOutlined />,
    },
  ];

  const Logo = () => {
    return (
      <Header
        className={styles.header}
        style={{ backgroundColor: token.colorBgContainer }}
      >
        <Link style={{ color: token.colorText }} href="/">
          MeuEstagio
        </Link>
      </Header>
    );
  };
  const LogoTipo = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Link style={{ color: token.colorText }} href="/">
          <GlobalOutlined />
        </Link>
      </div>
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{ backgroundColor: token.colorBgBase }}
          className={styles.sider}
          breakpoint="md"
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <LogoTipo /> : <Logo />}
          <Menu
            mode="vertical"
            items={menuItems}
            style={{ backgroundColor: token.colorBgContainer }}
          />
        </Sider>
        <Layout>
          <Content
            style={{ backgroundColor: token.colorBgContainer }}
            className={styles.content}
          >
            {children}
          </Content>
          <Footer
            style={{ backgroundColor: token.colorBgContainer }}
            className={styles.footer}
          >
            <p>MeuEstagio - Trabalho de TCC</p>
          </Footer>
        </Layout>
      </Layout>
    </Space>
  );
}
