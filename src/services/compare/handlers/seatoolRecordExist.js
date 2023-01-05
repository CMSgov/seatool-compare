import { getItem } from "../../../libs/dynamodb-lib";

exports.handler = async function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const id = event.Context.Execution.Input.id;
  const data = { seatoolExist: false, id };
  try {
    const item = await getItem(process.env.seatoolTableName, id);

    if (item) {
      data.seatoolExist = true;
      data.seatoolRecord = item;
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log(
      `data after finding seatool item: ${JSON.stringify(data, null, 2)}`
    );

    callback(null, data);
  }
};