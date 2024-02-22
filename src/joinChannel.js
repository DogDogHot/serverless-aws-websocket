// handler.connect 핸들러 부분 작성
const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId
  const channel = JSON.parse(event.body).channel

  //dynamodb 에서

  try {
    // await ddb
    //   .update({
    //     TableName: "hyunin-websocket-table-test",
    //     Key: {
    //       id: connectionId,
    //     },
    //     UpdateExpression: "SET #channel = list_append(#channel, :newChannel)",
    //     ExpressionAttributeNames: {
    //       "#channel": "channel",
    //     },
    //     ExpressionAttributeValues: {
    //       ":newChannel": channel,
    //     },
    //   })
    //   .promise()

    await ddb
      .put({
        TableName: "hyunin-websocket-table-test",
        Item: {
          connectionId: connectionId,
          channel: channel,
        },
      })
      .promise()
  } catch (error) {
    console.log("Error:", error)
    return { statusCode: 500, body: error.stack }
  }

  return { statusCode: 200, body: "Connected." }
}
