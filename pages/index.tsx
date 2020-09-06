import React from 'react';
import { Button, Divider, Table, Typography } from 'antd';
import { getProxyList, getProxyStatusLabelByCode, ProxyItem, ProxyStatus } from '@/services/proxy';
import styles from './index.scss';
import { open } from '@/components/index/ProxyItemEditor';

export interface HomeProps {
  data: ProxyItem[];
}

const Home = (props: HomeProps) => {
  const { data } = props;

  async function handleAddProxyItem() {
    await open();
  }

  return (
    <div className={styles.root}>
      <Typography.Title level={2}>路由管理</Typography.Title>
      <Divider />
      <div className={styles.nav}>
        <Typography.Title level={3}>路由列表</Typography.Title>
        <Button type="primary" onClick={handleAddProxyItem}>
          添加
        </Button>
      </div>
      <Table<ProxyItem> dataSource={data}>
        <Table.Column title="URL匹配" key="urlPattern" dataIndex="urlPattern" />
        <Table.Column title="代理服务" key="urlPattern" dataIndex="proxyServer" />
        <Table.Column title="测试URL" key="urlPattern" dataIndex="testUrl" />
        <Table.Column
          title="状态"
          key="status"
          render={(value) => getProxyStatusLabelByCode(value.status)}
        />
        <Table.Column
          title="操作"
          key="operation"
          render={(value) => (
            <>
              {value.status !== ProxyStatus.running && <Button>启动</Button>}
              {value.status !== ProxyStatus.stopped && <Button danger>停止</Button>}
            </>
          )}
        />
      </Table>
    </div>
  );
};

Home.getInitialProps = async () => {
  const res = await getProxyList();
  return { data: res };
};

export default Home;
