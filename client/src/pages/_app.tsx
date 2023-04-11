import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import PageLayout from "../../components/Layout";

import "../../styles/globals.css";

import { AuthProvider } from "../contexts/AuthContext";
import { Config } from "../contexts/ConfigProvider";

export default function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <AuthProvider>
      <Config>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Config>
    </AuthProvider>
  );
}
