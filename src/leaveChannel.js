// handler.connect 핸들러 부분 작성
const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId
  const channel = JSON.parse(event.body).channel

  // dynamodb에서 list 값의 특정값만 제외해서 업데이트하고싶은데 쿼리로 어떻게 짜야할까?
  // const AWS = require("aws-sdk")
  // const dynamoDB = new AWS.DynamoDB.DocumentClient()

  // const updateItem = async (id, listToRemove) => {
  //   // 1. 기존 항목을 가져옵니다.

  //   // 3. 업데이트된 항목을 저장합니다.
  //   const updateItemParams = {
  //     TableName: "my-table",
  //     Key: { id },
  //     UpdateExpression: "set #list = :updatedList",
  //     ExpressionAttributeNames: { "#list": "list" },
  //     ExpressionAttributeValues: { ":updatedList": updatedList },
  //   }
  //   await dynamoDB.update(updateItemParams).promise()
  // }

  try {
    // const { Item } = await ddb
    //   .get({
    //     TableName: "hyunin-websocket-table-test",
    //     Key: { id: connectionId },
    //   })
    //   .promise()

    // const updatedChannel = Item.channel.filter(
    //   (item) => !item.includes(channel)
    // )

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
    //       ":newChannel": updatedChannel,
    //     },
    //   })
    //   .promise()
    await ddb
      .delete({
        TableName: "hyunin-websocket-table-test",
        Key: {
          connectionId: connectionId,
          channel: channel,
        },
      })
      .promise()

    // dynamodb 에서 특정키가
  } catch (error) {
    console.log("Error:", error)
    return { statusCode: 500, body: error.stack }
  }

  return { statusCode: 200, body: "Connected." }
}
