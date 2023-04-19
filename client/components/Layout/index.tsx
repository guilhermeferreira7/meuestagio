import { Layout, Menu, Space, theme } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Link from "next/link";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import styles from "./styles.module.css";
import { AuthContext } from "../../src/contexts/AuthContext";
import StudentMenu from "./menu/student-menu";
import DefaultMenu from "./menu/default-menu";

interface PageLayoutProps {
  children: ReactNode;
}

const { useToken } = theme;
const { Sider, Header, Content, Footer } = Layout;

export default function PageLayout({ children }: PageLayoutProps) {
  // this is the token from the theme
  const { token: designToken } = useToken();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);

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
        style={{ backgroundColor: designToken.colorBgContainer }}
      >
        <Link style={{ color: designToken.colorText }} href="/">
          MeuEstagio
        </Link>
      </Header>
    );
  };
  const LogoTipo = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Link style={{ color: designToken.colorText }} href="/">
          <GlobalOutlined />
        </Link>
      </div>
    );
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{ backgroundColor: designToken.colorBgBase }}
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
            style={{ backgroundColor: designToken.colorBgContainer }}
          />
        </Sider>
        <Layout>
          <Content
            style={{ backgroundColor: designToken.colorBgContainer }}
            className={styles.content}
          >
            {children}
          </Content>
          <Footer
            style={{ backgroundColor: designToken.colorBgContainer }}
            className={styles.footer}
          >
            <p>MeuEstagio - Trabalho de TCC</p>
          </Footer>
        </Layout>
      </Layout>
    </Space>
  );
}
