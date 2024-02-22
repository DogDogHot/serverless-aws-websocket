const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async function (event, context) {
  let connections = {
    Items: [],
  }
  const channel = JSON.parse(event.body).channel
  try {
    if (channel) {
      let isContinue = true
      while (isContinue) {
        const params = {
          TableName: "hyunin-websocket-table-test",
          IndexName: "channel-index",
          KeyConditionExpression: "channel = :channel",
          ExpressionAttributeValues: {
            ":channel": channel,
          },
        }
        const result = await ddb.query(params).promise()
        connections.Items = [...connections.Items, ...result.Items]
        if (!result.LastEvaluatedKey) {
          isContinue = false
        }
      }
    } else {
      throw new Error()
    }
  } catch (err) {
    return {
      statusCode: 500,
    }
  }
  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  })

  const message = JSON.parse(event.body).message

  const sendMessages = connections.Items.map(async ({ connectionId }) => {
    if (connectionId !== event.requestContext.connectionId) {
      try {
        await callbackAPI
          .postToConnection({ ConnectionId: connectionId, Data: message })
          .promise()
      } catch (e) {
        console.log(e)
      }
    }
  })

  try {
    await Promise.all(sendMessages)
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
    }
  }

  return { statusCode: 200 }
}
