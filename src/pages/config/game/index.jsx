import { useState } from "React";
import { connect } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from "antd";
const GameConfig = (props) => {
    const { games } = props;
    const [isAddGame, setIsAddGame] = useState(false);
    const columns = [
        {
            title: "name",
            dataIndex: "name"
        },
        {
            title: "value",
            dataIndex: "value"
        },
    ];

    const handleOk = e => {
        console.log(e);
        setIsAddGame(false);
    };

    return (
        <PageContainer>
            <ProTable search={false} pagination={false} dataSource={games} columns={columns}
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
                onCancel={() => setIsAddGame(false)}
            >
                <Input></Input>
            </Modal>
        </PageContainer>
    );
}

export default connect(({ global }) => ({
    games: global.games,
}))(GameConfig);