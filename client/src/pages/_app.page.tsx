import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";

import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { PageLayout } from "components";
import { AuthProvider } from "contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <AuthProvider>
      <PageLayout>
        <NextNProgress />
        <Component {...pageProps} />
      </PageLayout>
    </AuthProvider>
  );
}
