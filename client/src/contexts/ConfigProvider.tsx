import { ReactNode } from "react";
import { ConfigProvider } from "antd";
import { createContext } from "vm";
import { ConfigProviderProps } from "antd/es/config-provider";

interface Props {
  children?: ReactNode;
}
export const ConfigContext = createContext({} as ConfigProviderProps);

export const Config = ({ children }: Props) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#a5ced8",
          colorBgContainer: "white",
          colorText: "black",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
