import { PageContainer } from '@ant-design/pro-layout';
import { Table, Row, Col, Button, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DatePicker from '@/components/DatePicker';
import React from 'react';
import { connect } from 'umi';
import { queryAbGroupList, queryAbGroupStatistic } from './service';
import { dayjs, getPercent } from '@/utils/utils';

const Option = Select.Option;
@connect(({ global }) => ({
  didabuId: global.didabuId,
}))
class ABGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      abGroups: [{ name: 'ac_dollar1' }],
      abGroup: null,
      needReload: false,
      data: [],
      date: dayjs.utc().subtract(1, 'd'),
    };

    this.queryABGroups = this.queryABGroups.bind(this);
    this.queryStatisticData = this.queryStatisticData.bind(this);
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (this.props.didabuId && this.props.didabuId !== prevProps.didabuId) {
  //     this.queryABGroups();
  //   }
  // }

  // componentDidMount() {
  //   if (this.props.didabuId) {
  //     this.queryABGroups();
  //   }
  // }

  queryStatisticData() {
    const { didabuId } = this.props;
    const { abGroup, date } = this.state;
    if (didabuId && abGroup && date) {
      this.setState({ loading: true });
      queryAbGroupStatistic(didabuId, abGroup, date?.valueOf()).then(({ data }) => {
        this.setState({ loading: false, data });
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
        <Table bordered columns={columns} dataSource={this.state.data}></Table>
      </PageContainer>
    );
  }
}

const columns = [
  {
    key: 'key',
    title: 'AB分组',
    dataIndex: 'ab_group',
    render(text, data, index) {
      return text.split('#')[1];
    },
  },
  {
    title: '用户来源',
    dataIndex: 'organic',
    render(text, data, index) {
      return ['非自然', '自然'][text];
    },
    filterMultiple: false,
    filters: [
      { text: '自然', value: 1 },
      { text: '非自然', value: 0 },
    ],
    onFilter(value, record) {
      return record.organic === value;
    },
  },
  {
    title: '留存日期',
    dataIndex: 'retention_date',
    render(text) {
      return dayjs.utc(text).format('YYYY-MM-DD');
    },
  },
  {
    title: '注册人数',
    dataIndex: 'register',
  },
  {
    title: '留存人数',
    dataIndex: 'retention',
  },
  {
    title: '留存(%)',
    dataIndex: 'retention',
    render(text, row, index) {
      return getPercent(text, row.register);
    },
  },
  {
    title: '广告次数',
    dataIndex: 'ad_count',
  },
  {
    title: '收益',
    dataIndex: 'revenue',
  },
];

export default ABGroup;
