import "@styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { AuthProvider } from "../contexts/AuthContext";
import PageLayout from "../components/Layout";

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
