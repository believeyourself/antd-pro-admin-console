import { PageContainer } from '@ant-design/pro-layout';
import { Table, Row, Col, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DatePicker from '@/components/DatePicker';
import React from 'react';
import { connect } from 'umi';
import { queryAbGroupStatistic } from './service';
import { dayjs } from '@/utils/utils';
import ListSearch from '@/components/ListSearch';

@connect(({ global }) => ({
  didabuId: global.didabuId,
}))
class ABGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      needReload: false,
      data: [],
      date: dayjs.utc().subtract(2, 'd'),
    };

    this.queryStatisticData = this.queryStatisticData.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.didabuId && this.props.didabuId !== prevProps.didabuId) {
      this.queryStatisticData();
    }
  }

  componentDidMount() {
    if (this.props.didabuId) {
      this.queryStatisticData();
    }
  }

  queryStatisticData() {
    const { didabuId } = this.props;
    let { date } = this.state;
    if (didabuId && date) {
      this.setState({ loading: true });
      let dateTime = date.hour(0).minute(0).second(0).millisecond(0).valueOf();
      queryAbGroupStatistic(didabuId, dateTime).then(({ data }) => {
        this.setState({ loading: false, data });
      });
    }
  }

  render() {
    return (
      <PageContainer>
        <ListSearch
          filters={[
            <div key="date">
              注册日期：
              <DatePicker
                value={this.state.date}
                onChange={(date, formatStr) => this.setState({ date })}
              />
            </div>,
          ]}
          toolbars={[
            <Button
              key="search"
              onClick={this.queryStatisticData}
              loading={this.state.loading}
              icon={<SearchOutlined />}
              type="primary"
            >
              查询
            </Button>,
          ]}
        />
        <Table
          loading={this.state.loading}
          bordered
          columns={columns}
          dataSource={this.state.data}
        ></Table>
      </PageContainer>
    );
  }
}

const columns = [
  {
    key: 'key',
    title: 'AB分组',
    dataIndex: 'ab_group',
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
  // {
  //   title: '注册人数',
  //   dataIndex: 'register',
  // },
  // {
  //   title: '留存人数',
  //   dataIndex: 'retention',
  // },
  // {
  //   title: '留存(%)',
  //   dataIndex: 'retention',
  //   render(text, row, index) {
  //     return getPercent(text, row.register);
  //   },
  // },
  {
    title: '广告次数',
    dataIndex: 'ad_count',
  },
  {
    title: '收益',
    dataIndex: 'revenue',
  },
  {
    title: 'ecpm',
    render(text, rowData, index) {
      let { revenue, ad_count } = rowData;
      if (ad_count <= 0) {
        return '--';
      }
      return ((revenue / ad_count) * 1000).toFixed(3);
    },
  },
];

export default ABGroup;
