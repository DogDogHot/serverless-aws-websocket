// handler.connect 핸들러 부분 작성
const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId
  const endpoint =
    event.requestContext.domainName + "/" + event.requestContext.stage

  try {
    await ddb
      .put({
        TableName: "hyunin-websocket-table-test",
        Item: {
          connectionId: connectionId,
          channel: "global",
        },
      })
      .promise()
  } catch (error) {
    console.log("Error:", error)
    return { statusCode: 500, body: error.stack }
  }

  return { statusCode: 200, body: "Connected." }
}
