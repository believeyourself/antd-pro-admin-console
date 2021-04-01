const mockjs = require('mockjs');
let mockData = mockjs.mock({
  'list|5': [{ 'hour|+1': 0, 'register|1000-2000': 0, 'retention|0-1000': 0 }],
});

console.log(mockData);
