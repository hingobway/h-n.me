const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  BatchWriteCommand,
} = require('@aws-sdk/lib-dynamodb');

const { AWSREGION: AWS_REGION } = process.env;

const dbClient = new DynamoDBClient({ region: AWS_REGION });
const db = DynamoDBDocumentClient.from(dbClient, {
  marshallOptions: {},
  unmarshallOptions: {},
});

module.exports.get = async (TableName, Key, include) => {
  if (!(TableName.length && Key))
    throw new Error('Missing table name or primary key.');

  include = include || [];
  const att = include.reduce(
    (obj, it, i) => ({ ...obj, [`#${String.fromCharCode(97 + i)}`]: it }),
    {}
  );
  const doIncludes = !!Object.keys(att).length;
  try {
    return (
      await db.send(
        new GetCommand({
          TableName,
          ExpressionAttributeNames: doIncludes ? att : undefined,
          ProjectionExpression: doIncludes
            ? Object.keys(att).join(', ')
            : undefined,
          Key,
        })
      )
    ).Item;
  } catch (error) {
    throw error;
  }
};

module.exports.put = async (TableName, Item) => {
  if (!(TableName.length && Item))
    throw new Error('Missing table name or item.');

  try {
    await db.send(new PutCommand({ TableName, Item }));
  } catch (error) {
    throw error;
  }
};

module.exports.query = async (TableName, { key, value, include: include_ }) => {
  const include = include_ || [];
  let keyindex;
  if ((keyindex = include.indexOf(key)) < 0) {
    include.push(key);
    keyindex = include.length - 1;
  }
  const att = include.reduce(
    (obj, it, i) => ({ ...obj, [`#${String.fromCharCode(97 + i)}`]: it }),
    {}
  );
  const includeFilter = Object.keys(att)
    .slice(0, include_ ? include_.length : 0)
    .join(',');
  att['#qname'] = 'query';
  const ExpressionAttributeValues = { ':qval': 0, ':value': value };

  try {
    return (
      await db.send(
        new QueryCommand({
          TableName,
          ExpressionAttributeNames: att,
          ProjectionExpression: includeFilter,
          IndexName: key,
          KeyConditionExpression: `
        #qname = :qval AND 
        ${Object.keys(att)[keyindex]} = :value`,
          ExpressionAttributeValues,
        })
      )
    ).Items;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.update = async (TableName, { id: Key, add, remove }) => {
  const dontAdd = !add;
  add = add || {};
  const keys = Object.keys(add).reduce(
    (obj, it, i) => ({ ...obj, [`#k${i.toString(16)}`]: it }),
    {}
  );
  const vals = Object.keys(add).reduce(
    (obj, it, i) => ({ ...obj, [`:v${i.toString(16)}`]: add[it] }),
    {}
  );
  if (remove && remove.length)
    remove.forEach((it, i) => {
      if (vals.indexOf(it) >= 0) return;
      vals[`#k${vals.length.toString(16)}`] = it;
    });
  try {
    const data = await db.send(
      new UpdateCommand({
        TableName,
        Key,
        ReturnValues: 'ALL_NEW',
        ExpressionAttributeNames: keys || undefined,
        ExpressionAttributeValues: vals || undefined,
        UpdateExpression:
          (dontAdd
            ? ''
            : `set ${Object.keys(keys)
                .map((it, i) => `${it} = ${Object.keys(vals)[i]}`)
                .join(', ')} `) +
          (!remove
            ? ''
            : `remove ${Object.keys(vals)
                .slice(Object.keys(keys).length)
                .map((it) => `${it}`)
                .join(', ')}`),
      })
    );
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.import = async (table, items) => {
  const REQLIM = 25; // max requests allowed in one api call.
  const requests = [];
  for (let i = 0; i < Math.ceil(items.length / REQLIM); i++) {
    requests.push({});
    requests[i][table] = Object.assign([], items)
      .splice(i * REQLIM, REQLIM)
      .map((it) => ({
        PutRequest: {
          Item: (({ path, url }) => ({ path, url }))(it),
        },
      }));
  }

  try {
    requests.forEach(async (req) => {
      const { UnprocessedItems: unproc } = await db.send(
        new BatchWriteCommand({
          RequestItems: req,
        })
      );
      console.log(unproc);
    });
  } catch (error) {
    throw error;
  }
};
