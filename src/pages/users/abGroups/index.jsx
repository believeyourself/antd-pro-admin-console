import { PageContainer } from '@ant-design/pro-layout';
import { Table, Row, Col, Button, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DatePicker from '@/components/DatePicker';
import React from 'react';
import { connect } from 'umi';
import { queryAbGroupList, queryAbGroupStatistic } from './service';

const Option = Select.Option;
@connect(({ global }) => ({
  didabuId: global.didabuId,
}))
class ABGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      abGroups: [],
      abGroup: null,
      needReload: false,
      data: [],
      date: null,
    };

    this.queryABGroups = this.queryABGroups.bind(this);
    this.queryStatisticData = this.queryStatisticData.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.didabuId && this.props.didabuId !== prevProps.didabuId) {
      this.queryABGroups();
    }
  }

  componentDidMount() {
    if (this.props.didabuId) {
      this.queryABGroups();
    }
  }

  queryStatisticData() {
    if (this.props.didabuId && this.state.abGroup && this.state.date) {
      this.setState({ loading: true });
      queryAbGroupStatistic(this.props.didabuId).then(({ data }) => {
        this.setState({ abGroups: data, loading: false, abGroup: null });
      });
    }
  }

  queryABGroups() {
    if (this.props.didabuId) {
      this.setState({ loading: true });
      queryAbGroupList(this.props.didabuId).then(({ data }) => {
        this.setState({ abGroups: data, loading: false, abGroup: null });
      });
    } else {
      message.error('请选择游戏');
    }
  }

  render() {
    const { abGroups, abGroup } = this.state;
    let options = abGroups.map((item) => {
      return <Option key={item.name}>{item.name}</Option>;
    });
    return (
      <PageContainer>
        <Row style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
          <Col xs={24} sm={8} md={8} span={8}>
            AB分组：
            <Select
              clear="true"
              value={abGroup}
              onChange={(value) => this.setState({ abGroup: value })}
              style={{ width: '80%' }}
              placeholder="请选择"
              allowClear
            >
              {options}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={8} span={8}>
            注册日期：
            <DatePicker
              value={this.state.date}
              onChange={(date) => this.setState({ date })}
              style={{ width: '80%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={8} span={8} style={{ textAlign: 'right' }}>
            <Button
              onClick={this.queryStatisticData}
              loading={this.state.loading}
              icon={<SearchOutlined />}
              type="primary"
            >
              查询
            </Button>
          </Col>
        </Row>
        <Table bordered columns={columns}></Table>
      </PageContainer>
    );
  }
}

const columns = [
  {
    title: 'AB分组',
    dataIndex: 'value',
  },
  {
    title: '用户来源',
    dataIndex: 'organic',
    render(text, index, data) {
      return ['非自然', '自然'][text];
    },
  },
  {
    title: '注册日期',
    dataIndex: 'value',
  },
  {
    title: '次留',
    children: [
      {
        title: '留存',
        dataIndex: 'retention',
      },
      {
        title: '广告次数',
        dataIndex: 'ad_count',
      },
      {
        title: '收益',
        dataIndex: 'revenue',
      },
    ],
  },
  {
    title: '三留',
    children: [
      {
        title: '留存',
        dataIndex: 'retention',
      },
      {
        title: '广告次数',
        dataIndex: 'ad_count',
      },
      {
        title: '收益',
        dataIndex: 'revenue',
      },
    ],
  },
  {
    title: '四留',
    children: [
      {
        title: '留存',
        dataIndex: 'retention',
      },
      {
        title: '广告次数',
        dataIndex: 'ad_count',
      },
      {
        title: '收益',
        dataIndex: 'revenue',
      },
    ],
  },
  {
    title: '七留',
    children: [
      {
        title: '留存',
        dataIndex: 'retention',
      },
      {
        title: '广告次数',
        dataIndex: 'ad_count',
      },
      {
        title: '收益',
        dataIndex: 'revenue',
      },
    ],
  },
];

export default ABGroup;
