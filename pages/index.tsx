import React, { useEffect, useState } from 'react';
import { Button, Divider, message, Table, Typography, Space } from 'antd';
import {
  createProxyItem,
  getProxyList,
  getProxyStatusLabelByCode,
  ProxyItem,
  ProxyStatus,
  updateProxyItem
} from '@/services/proxy';
import styles from './index.scss';
import { open } from '@/components/index/ProxyItemEditor';

export interface HomeProps {
  data: ProxyItem[];
}

const Home = (props: HomeProps) => {
  const { data } = props;
  const [list, setList] = useState([...data]);
  const [loading, setLoading] = useState(false);

  async function updateList() {
    setLoading(true);
    const res = await getProxyList();
    setList(res);
    setLoading(false);
  }

  async function handleAdd() {
    const data = await open();
    await createProxyItem(data);
    message.success('添加成功');
    await updateList();
  }

  async function handleUpdate(item: ProxyItem) {
    const data = await open({ id: item.id });
    await updateProxyItem({ ...data, id: item.id });
    message.success('更新成功');
    await updateList();
  }

  async function handleStart(item: ProxyItem) {
    await updateProxyItem({ ...item, status: ProxyStatus.running });
    message.success('启动成功');
    await updateList();
  }

  async function handleStop(item: ProxyItem) {
    await updateProxyItem({ ...item, status: ProxyStatus.stopped });
    message.success('停止成功');
    await updateList();
  }

  return (
    <div className={styles.root}>
      <Typography.Title level={2}>路由管理</Typography.Title>
      <Divider />
      <div className={styles.nav}>
        <Typography.Title level={3}>路由列表</Typography.Title>
        <Button type="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>
      <Table<ProxyItem> dataSource={list} loading={loading} rowKey="id">
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
            <Space>
              {value.status !== ProxyStatus.running && (
                <Button onClick={() => handleStart(value)}>启动</Button>
              )}
              {value.status !== ProxyStatus.stopped && (
                <Button danger onClick={() => handleStop(value)}>
                  停止
                </Button>
              )}
              <Button onClick={() => handleUpdate(value)}>编辑</Button>
            </Space>
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
