import { Layout, Menu, Space, theme } from "antd";
import {
  LoginOutlined,
  HomeOutlined,
  UserAddOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React, { ReactNode, useContext, useState } from "react";

import styles from "./styles.module.css";
import { parseCookies } from "nookies";
import { AuthContext } from "../../src/contexts/AuthContext";
import StudentMenu from "./menu/student-menu";
import DefaultMenu from "./menu/default-menu";

interface PageLayoutProps {
  children: ReactNode;
}

const { useToken } = theme;
const { Sider, Header, Content, Footer } = Layout;

export default function PageLayout({ children }: PageLayoutProps) {
  const { token } = useToken();
  const { user } = useContext(AuthContext);

  const [collapsed, setCollapsed] = useState(false);

  let menuItems = [];
  if (user?.role === "student") {
    menuItems = StudentMenu();
  } else {
    menuItems = DefaultMenu();
  }

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
