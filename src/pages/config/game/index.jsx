import React, { useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { addGame } from '../../../services/config';
const GameConfig = (props) => {
  const { games, dispatch } = props;
  const [form] = Form.useForm();
  const [isAddGame, setIsAddGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'platform',
      dataIndex: 'platform',
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'didabuId',
      dataIndex: 'didabuId',
    },
  ];

  let dataSource = games.map((e) => {
    let name = e.name;
    let id = e.value.split('#')[0];
    let platform = e.value.split('#')[1];
    return { name, id, platform, key: e.value, didabuId: e.didabuId };
  });

  const handleOk = async (e) => {
    let newGame = await form.validateFields();
    let data = {
      keyType: 'games',
      name: newGame.name,
      value: `${newGame.id}#${newGame.platform}`,
    };
    setLoading(true);
    await addGame(data);
    form.resetFields();
    setIsAddGame(false);
    setLoading(false);
    dispatch({
      type: 'global/initGames',
    });
    message.success('添加成功');
  };

  const handleCancel = async (e) => {
    form.resetFields();
    setIsAddGame(false);
    setLoading(false);
  };

  return (
    <PageContainer>
      <ProTable
        search={false}
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        toolBarRender={() => [
          <Button
            onClick={() => setIsAddGame(true)}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>,
        ]}
      ></ProTable>
      <Modal
        title="新增游戏"
        centered
        visible={isAddGame}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 3 }}>
          <Form.Item
            name="id"
            label="ID"
            required
            rules={[
              {
                required: true,
                message: '请输入游戏ID',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="platform"
            label="平台"
            required
            rules={[
              {
                required: true,
                message: '请选择游戏平台',
              },
            ]}
          >
            <Select placeholder="请选择">
              <Select.Option value="ios">IOS</Select.Option>
              <Select.Option value="android">安卓</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            required
            rules={[
              {
                required: true,
                message: '请输入游戏名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div>
            <p>appsflyer管理后台中需要给对应游戏配置install事件push API回调：</p>
            <p>https://eilr4u8rd8.execute-api.us-west-2.amazonaws.com/prod/common</p>
            <p>appsflyer管理后台中需要给对应游戏配置应用内事件push API回调：</p>
            <p>https://yd71q09p27.execute-api.us-west-2.amazonaws.com/prod/common</p>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ global }) => ({
  games: global.games,
}))(GameConfig);
