import React, { useState } from 'react';
import { connect } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Select } from "antd";
import { addGame } from "../../../services/config";
const GameConfig = (props) => {
    const { games, dispatch } = props;
    const [form] = Form.useForm();
    const [isAddGame, setIsAddGame] = useState(false);
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: "ID",
            dataIndex: "id"
        },
        {
            title: "platform",
            dataIndex: "platform"
        }, {
            title: "name",
            dataIndex: "name"
        },
    ];

    let dataSource = games.map((e) => {
        let name = e.name;
        let id = e.value.split("#")[0];
        let platform = e.value.split("#")[1];
        return { name, id, platform, key: e.value };
    });

    const handleOk = async e => {
        let newGame = await form.validateFields();
        let data = {
            keyType: "games",
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
    };

    const handleCancel = async e => {
        form.resetFields();
        setIsAddGame(false);
        setLoading(false);
    };

    return (
        <PageContainer>
            <ProTable search={false} pagination={false} dataSource={dataSource} columns={columns}
                toolBarRender={() => [
                    <Button onClick={() => setIsAddGame(true)} key="button" icon={<PlusOutlined />} type="primary">
                        新建
                </Button>]}
            >
            </ProTable>
            <Modal
                title="新增游戏"
                centered
                visible={isAddGame}
                onOk={handleOk}
                confirmLoading={loading}
                onCancel={handleCancel}
            >
                <Form form={form} labelCol={{ span: 4 }}>
                    <Form.Item name="id" label="ID" required rules={[
                        {
                            required: true,
                            message: '请输入游戏ID',
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="platform" label="平台" required rules={[
                        {
                            required: true,
                            message: '请选择游戏平台',
                        },
                    ]}>
                        <Select placeholder="请选择">
                            <Select.Option value="ios">IOS</Select.Option>
                            <Select.Option value="android">安卓</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="名称" required rules={[
                        {
                            required: true,
                            message: '请输入游戏名称',
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
}

export default connect(({ global }) => ({
    games: global.games,
}))(GameConfig);