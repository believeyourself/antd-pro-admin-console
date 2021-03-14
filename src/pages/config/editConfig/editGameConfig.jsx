import React, { useState } from 'react';
import { connect } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Input, Row, Col, Divider, Select } from "antd";
import style from "./style.less";

const Option = Select.Option;
const games = [
    {id:"1348530758271451138",name:"ArcadePusher"},
    {id:"1348530758271451139",name:"Slotsgo"},
    {id:"1348530758271451140",name:"SuperDunk"},
    {id:"1348530758271451141",name:"SuperPusher"},
    {id:"1348530758271451142",name:"SpinGo"},
    {id:"1348530758271451143",name:"Test"},
]

const gameOptions = [];
games.forEach((game)=>{
    gameOptions.push(<Option key={game.id} value={game.id}>{game.name}</Option>)
})

const GameConfig = (props) => {
    const [appId, setAppId] = useState();
    const [eventCount, setEventCount] = useState();
    const [ABGroup, setABGroup] = useState();
    const [events, setEvents] = useState();
    const [assets, setAssets] = useState();
    const [assetNames, setAssetNames] = useState();
    const [controlData, setControlData] = useState();

    return (
        <PageContainer>
            <div className={style.container}>
                <Row>
                    <Col {...selectGamesCol}>
                        <Select value={appId} onChange={(value)=>setAppId(value)} placeholder="请选择游戏" className={style.game_select}>
                            {gameOptions}
                        </Select>
                    </Col>
                </Row>
                <Divider />
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        事件计数：
                    </Col>
                    <Col {...inputCol}>
                        <Input allowClear value={eventCount} />
                    </Col>
                    <Col {...buttonCol}>
                        <Button type="primary">保存</Button>
                    </Col>
                </Row>
                <Divider />
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        AB GROUP设置：
                    </Col>
                    <Col {...inputCol}>
                        <Input allowClear />
                    </Col>
                    <Col {...buttonCol}>
                        <Button type="primary">保存</Button>
                    </Col>
                </Row>
                <Divider />
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        didabu事件:
                    </Col>
                    <Col {...inputCol}>
                        <Input allowClear />
                    </Col>
                    <Col {...buttonCol}>
                        <Button type="primary">保存</Button>
                    </Col>
                </Row>
                <Divider />
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        资产配置：
                    </Col>
                    <Col {...inputCol}>
                        <Input allowClear />
                    </Col>
                </Row>
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        资产事件参数名字：
                    </Col>
                    <Col {...inputCol}>
                        <Input allowClear />
                    </Col>
                    <Col {...buttonCol}>
                        <Button type="primary">保存</Button>
                    </Col>
                </Row>
                <Divider />
                <Row className={style.item}>
                    <Col className={style.label} {...labelCol}>
                        控制数值:
                    </Col>
                    <Col {...inputCol}>
                        <input type="file" />
                    </Col>
                    <Col {...buttonCol}>
                        <Button type="primary">保存</Button>
                    </Col>
                </Row>
            </div>
        </PageContainer >
    );
}

export default connect(({ global }) => ({
    games: global.games,
    gameType: global.gameType,
}))(GameConfig);

const selectGamesCol = {
    xs: { span: 24 },
    sm: { span: 12, offset: 6 },
    md: { span: 8, offset: 8 },
    lg: { span: 6, offset: 9 }
}

const labelCol = {
    xs: { span: 24 },
    sm: { span: 4, offset: 2 },
    md: { span: 4, offset: 4 },
    lg: { span: 2, offset: 7 }
}

const inputCol = {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 8, },
    lg: { span: 6 }
}

const buttonCol = {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 4, },
    lg: { span: 2 }
}