import React from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Skeleton, Row, Col, Button } from 'antd';
import DatePicker from '@/components/DatePicker';
import { dayjs } from '@/utils/utils';
import style from './welcome.less';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: dayjs.utc().subtract(1, 'd'),
      isReady: false,
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAdCountDetail = this.handleAdCountDetail.bind(this);
  }

  handleDate(date) {
    this.setState({ date });
  }

  handleSearch() {
    this.props.dispatch({
      type: 'home/init',
      date: this.state.date.valueOf(),
    });
  }

  handleAdCountDetail(gameType) {
    this.props.dispatch({
      type: 'global/selectGameType',
      gameType,
    });
    window.location.hash = `/users/exceptionAdUsers`;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.games.length != this.props.games.length && this.props.games.length > 0) {
      this.handleSearch();
    }
  }

  componentDidMount() {
    if (this.props.games.length > 0) {
      this.handleSearch();
    }
  }

  render() {
    const yesterday = dayjs.utc().subtract(1, 'd');
    const { loading, games, adCount = [] } = this.props;
    let adCountNodes = games.map((game) => {
      let temp = adCount.find((item) => {
        return game.didabuId == item.app_id;
      });
      return (
        <Row key={game.didabuId} className={style.flex_container}>
          <Col flex={1}>{game.name}：</Col>
          <Col className={style.right_text} flex={1}>
            <a onClick={() => this.handleAdCountDetail(game.value)}>{temp?.userCount || 0}</a> 人
          </Col>
        </Row>
      );
    });

    return (
      <PageContainer>
        <div className={style.filter}>
          <DatePicker
            disabledDate={(currentDate) => {
              return currentDate.utc() > yesterday;
            }}
            value={this.state.date}
            onChange={this.handleDate}
          />
          <Button onClick={this.handleSearch} loading={loading} type="primary">
            查询
          </Button>
        </div>
        <Row gutter={10}>
          <Col {...cardCol}>
            <Card title="广告次数超60次人数">
              <Skeleton loading={loading} active>
                {adCountNodes}
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

const cardCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 8 },
};

const mapStateToProps = ({ global, loading, home }, ownProps) => {
  let games = global.games.filter((game) => {
    return !!game.didabuId;
  });
  return {
    games,
    adCount: home.adCount,
    loading: loading.effects['home/init'],
  };
};

export default connect(mapStateToProps)(Home);
