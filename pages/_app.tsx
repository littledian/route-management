import React from 'react';
import NextApp from 'next/app';
import { Typography, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import styles from './_app.scss';

export default class App extends NextApp<{ pageProps: any }> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.root}>
          <div className={styles.main}>
            <Component {...pageProps} />
          </div>
          <div className={styles.foot}>
            <Typography.Link
              className={styles.link}
              href="http://www.beian.miit.gov.cn/"
              target="_blank"
            >
              浙ICP备19031225号
            </Typography.Link>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}
