import React, { useEffect, useState } from "react";
import { Form, DatePicker, Input, Button, Card, Row, Col, Space, Table } from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import * as moment from "moment";
import { queryData } from "./service"

const { RangePicker } = DatePicker;
export default function Invite() {
    const startTime = moment().subtract(1, "d").hour(0).minute(0).second(0);
    const endTime = moment().hour(0).minute(0).second(0);
    const [times, setTimes] = useState([startTime, endTime]);
    const [accountId, setAccountId] = useState();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setLoading(true);
        let params = {
            accountId,
            startTime: times[0].valueOf(),
            endTime: times[1].valueOf()
        }
        const { data } = await queryData(params);
        setData(data);
        setLoading(false);
    }

    const list = [];
    data.userCampaigns?.forEach((item) => {
        let progress = item.stageProgresses;
        let paypal = "--";
        progress.forEach((item) => {
            item.rewards.forEach((reward) => {
                if (reward.awardedMemo && reward.awardedMemo != "") {
                    paypal = reward.awardedMemo;
                }
            });
        });
        console.log(paypal)
        list.push({
            key: item.name,
            name: item.name,
            curValue_1: progress[0].currentValue,
            curValue_2: progress[1].currentValue,
            stage_1: `${progress[0].currentValue} / ${progress[0].finalValue}`,
            stage_2: `${progress[1].currentValue} / ${progress[1].finalValue}`,
            paypal,
            installs: data.installs
        })
    })

    const columns = [
        {
            title: 'facebook账户名',
            dataIndex: 'name',
            width: "20%",
        },
        {
            title: '阶段一',
            dataIndex: 'stage_1',
            sorter: {
                compare: (a, b) => a.curValue_1 - b.curValue_1,
            },
        },
        {
            title: '阶段二',
            dataIndex: 'stage_2',
            sorter: {
                compare: (a, b) => a.curValue_2 - b.curValue_2,
            },
        },
        {
            title: 'paypal',
            dataIndex: 'paypal',
            sorter: {
                compare: (a, b) => a.paypal > b.paypal,
            },
        },
    ]
    const expandColumns = [
        {
            title: 'accountId',
            dataIndex: 'accountId',
            key: "accountId"
        },
        {
            title: '安装时间(UTC)',
            dataIndex: 'installTime',
            render: (text, record, index) => {
                return moment.utc(text).format("YYYY-MM-DD HH:mm:ss");
            }
        },
    ];

    useEffect(() => {
        search();
    }, [])

    return <PageContainer>
        <Space direction="vertical" style={{ display: "flex" }}>
            <Form layout="inline" style={{ backgroundColor: "#fff", padding: "2rem 1rem" }}>
                <Form.Item label="时间">
                    <RangePicker showTime allowClear value={times} onChange={(times) => setTimes(times)} />
                </Form.Item>
                <Form.Item label="facebook账户名">
                    <Input allowClear value={accountId} onChange={(e) => setAccountId(e.target.value.trim())} />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} onClick={search} type="primary">查询</Button>
                </Form.Item>
            </Form>

            <Row gutter={{ xs: 0, md: 24 }}>
                <Col md={8} xs={24}>
                    <Card title="facebook绑定数" >
                        {data.installs ? "--" : data.invites}
                    </Card>
                </Col>
                <Col md={8} xs={24}>
                    <Card title="邀请人数" >
                        {data.installs ? "--" : data.install}
                    </Card>
                </Col>
                <Col md={8} xs={24}>
                    <Card title="填写paypal人数" >
                        {data.installs ? "--" : data.finish}
                    </Card>
                </Col>
            </Row >

            <Table
                columns={columns}
                dataSource={list}
                expandable={{
                    expandedRowRender: record => <Table key={record.accountId} columns={expandColumns} dataSource={record.installs}></Table>,
                    rowExpandable: record => record.installs?.length > 0
                }}
            ></Table>
        </Space>
    </PageContainer >
}