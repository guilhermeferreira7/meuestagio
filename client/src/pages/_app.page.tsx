import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";
import PageLayout from "@/components/Layout";

import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <AuthProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </AuthProvider>
  );
}
