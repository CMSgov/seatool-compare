import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { sendMetricData } from "./cloudwatch-lib";
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: process.env.region });

export const update = async ({ tableName, item }) => {
  const params = {
    TableName: tableName,
    Item: marshall(item),
  };

  try {
    console.log(`Putting item with id: ${item.id}:`);

    const command = new PutItemCommand(params);
    const result = await client.send(command);
    console.log(
      `Record processed for item: ${item.id}:`,
      JSON.stringify(result, null, 2)
    );

    await sendMetricData({
      Namespace: process.env.namespace,
      MetricData: [
        {
          MetricName: `${tableName}_dynamo_updates`,
          Value: 0,
        },
      ],
    });

    return result;
  } catch (error) {
    console.error(
      "ERROR updating record in dynamodb: ",
      error.toString("utf-8")
    );
    await sendMetricData({
      Namespace: process.env.namespace,
      MetricData: [
        {
          MetricName: `${tableName}_dynamo_updates`,
          Value: 1,
        },
      ],
    });
  }
};
