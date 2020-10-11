import NextDocument, { Head, Main, NextScript } from 'next/document';
import { DocumentProps as NextDocumentProps } from 'next/dist/next-server/lib/utils';
import { getFooterBlock, BlockItem } from '@/services/block';
import styles from './_document.scss';

interface DocumentProps extends NextDocumentProps {
  block: {
    footer: BlockItem;
  };
}

export default class Document extends NextDocument<DocumentProps> {
  static async getInitialProps(ctx) {
    const [initialProps, footer] = await Promise.all([
      NextDocument.getInitialProps(ctx),
      getFooterBlock()
    ]);
    return { ...initialProps, block: { footer } };
  }

  render() {
    const { block } = this.props;
    const { footer } = block;
    return (
      <html>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://www.smsqsrg.cn/static/antd/4.6.6/antd.min.css"
          />
          <style dangerouslySetInnerHTML={{ __html: footer.css.content }} />
        </Head>
        <body>
          <Main />
          <div
            {...(footer.html.attributes || {})}
            className="footer"
            dangerouslySetInnerHTML={{ __html: footer.html.content }}
          />
          <script src="https://www.smsqsrg.cn/static/react/16.13.1/react.production.min.js" />
          <script src="https://www.smsqsrg.cn/static/react-dom/16.13.1/react-dom.production.min.js" />
          <script src="https://www.smsqsrg.cn/static/moment/2.29.1/moment.min.js" />
          <script src="https://www.smsqsrg.cn/static/antd/4.6.6/antd-with-locales.min.js" />
          <script
            {...(footer.js.attributes || {})}
            dangerouslySetInnerHTML={{ __html: footer.js.content }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
