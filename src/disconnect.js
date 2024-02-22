const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async function (event, context) {
  const connectionId = event.requestContext.connectionId
  let connections = {
    Items: [],
  }
  try {
    let isContinue = true
    while (isContinue) {
      isContinue = false
      const params = {
        TableName: "hyunin-websocket-table-test",
        KeyConditionExpression: "connectionId = :connectionId",
        ExpressionAttributeValues: {
          ":connectionId": connectionId,
        },
      }
      const result = await ddb.query(params).promise()
      connections.Items = [...connections.Items, ...result.Items]
      if (!result.LastEvaluatedKey) {
        isContinue = false
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
    }
  }
  await Promise.all(
    connections.Items.map(async (item) => {
      await ddb
        .delete({
          TableName: "hyunin-websocket-table-test",
          Key: {
            connectionId: item.connectionId,
            channel: item.channel,
          },
        })
        .promise()
    })
  )
  return {
    statusCode: 200,
  }
}
