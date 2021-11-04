import "../styles/globals.css";
import Link from "next/link";
import Router from "next/router";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { Layout, Menu } from "antd";
import NProgress from "nprogress";

import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
}

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item>
            <Link href="/" passHref={true}>
              Properties
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: "50px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Component {...pageProps} />
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>Footer</Layout.Footer>
    </Layout>
  );
}
export default MyApp;
