const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB();
const moment = require('moment');

const MULTI = 10000000;
exports.handler = async (event) => {
  let { app_id, current_date, current = 1, pageSize = 10 } = event;
  let dates = [];
  if (current_date) {
    dates.push(current_date);
  } else {
    let offset = (current - 1) * pageSize;
    for (let i = offset; i < offset + pageSize; ++i) {
      dates.push(moment.utc().subtract(i, 'd').format('YYYY-MM-DD'));
    }
  }

  let data = [];
  for (let i = 0; i < dates.length; ++i) {
    current_date = dates[i];
    let PK = decodeURIComponent(`${app_id}#${current_date}`);
    //记录
    let params = {
      TableName: 'RoiAndRetentionDailyReport',
      ScanIndexForward: false,
      ProjectionExpression: 'current_date,organic_count,non_organic_count',
      Select: 'SPECIFIC_ATTRIBUTES',
      ExpressionAttributeValues: {
        ':PK': {
          S: PK,
        },
        ':install_date': {
          S: current_date,
        },
      },
      KeyConditionExpression: 'PK=:PK and install_date=:install_date',
    };

    let { Items: records } = await docClient.query(params).promise();
    for (let i = 0; i < records.length; ++i) {
      for (let attr in records[i]) {
        let key = Object.keys(records[i][attr])[0];
        records[i][attr] = records[i][attr][key];
      }
      records[i].key = `${PK}#${records[i].install_date}`;
      //次留数据
      let retention_count = await getRetentionCountByDate(app_id, current_date, 1);
      records[i].organic_retention = computedRetentionRate(
        records[i].organic_count,
        retention_count.organic_retention_count,
      );
      records[i].non_organic_retention = computedRetentionRate(
        records[i].non_organic_count,
        retention_count.non_organic_retention_count,
      );
      //渠道数据
      records[i].channel = await getChannelCount(app_id, current_date, current_date);
    }
    data.push(...records);
  }

  return {
    success: true,
    data: {
      records: data,
    },
  };
};

//渠道统计
async function getChannelCount(app_id, current_date, install_date) {
  let media_source_count = {};
  let PK = `${app_id}#${install_date}`;
  let params = {
    TableName: 'RoiAndRetentionCategoryDailyReport',
    ProjectionExpression: 'media_source,new_user_count',
    Select: 'SPECIFIC_ATTRIBUTES',
    ExpressionAttributeValues: {
      ':PK': {
        S: PK,
      },
      ':current_date': {
        S: current_date,
      },
    },
    FilterExpression: 'current_date=:current_date',
    KeyConditionExpression: 'PK=:PK',
  };

  let { Items: records, LastEvaluatedKey: lastEvaluatedKey } = await docClient
    .query(params)
    .promise();
  progressiveChannelCount(records, media_source_count);
  while (lastEvaluatedKey) {
    params.ExclusiveStartKey = lastEvaluatedKey;
    let result = await docClient.query(params).promise();
    let records = result.Items;
    lastEvaluatedKey = result.LastEvaluatedKey;
    progressiveChannelCount(records, media_source_count);
  }

  return media_source_count;
}

//渠道统计数据累计
function progressiveChannelCount(records, media_source_count) {
  for (let i = 0; i < records.length; ++i) {
    let item = records[i];
    let media_source = item.media_source.S;
    if (!media_source_count[media_source]) {
      media_source_count[media_source] = {
        new_user_count: Number(item.new_user_count.N),
      };
    } else {
      media_source_count[media_source].new_user_count += Number(item.new_user_count.N);
    }
  }
}

//留存人数查询
async function getRetentionCountByDate(app_id, current_date, interval_date) {
  let retention_date = moment.utc(current_date).add(interval_date, 'd').format('YYYY-MM-DD');
  let PK = `${app_id}#${retention_date}`;
  let params = {
    TableName: 'RoiAndRetentionDailyReport',
    ProjectionExpression: 'organic_retention_count,non_organic_retention_count',
    Select: 'SPECIFIC_ATTRIBUTES',
    ExpressionAttributeValues: {
      ':PK': {
        S: PK,
      },
      ':interval_date': { S: String(interval_date) },
    },
    FilterExpression: 'interval_date=:interval_date',
    KeyConditionExpression: 'PK=:PK',
  };

  let { Items: records } = await docClient.query(params).promise();
  return {
    organic_retention_count: records[0] ? records[0].organic_retention_count.N : '--',
    non_organic_retention_count: records[0] ? records[0].non_organic_retention_count.N : '--',
  };
}

//留存率计算
function computedRetentionRate(newCount, retentionCount) {
  if (isNaN(newCount) || isNaN(retentionCount) || newCount == 0) {
    return '--';
  }
  return ((retentionCount / newCount) * 100).toFixed(2);
}
