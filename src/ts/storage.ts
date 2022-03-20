import AWS from "aws-sdk";
import { uid } from "uid";

AWS.config.update({ region: "us-west-1" })

function _createClient(): AWS.DynamoDB {
  const accessKeyId = localStorage.getItem("accessKeyId")!;
  const secretAccessKey = localStorage.getItem("secretAccessKey")!;

  const client = new AWS.DynamoDB({
    region: "us-west-1", credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  return client;
}

export async function listTables(): Promise<string[]> {
  const client = _createClient();
  const request = client.listTables({});
  const response = await request.promise();
  return response.TableNames || [];
}

export async function saveResult(testName: string, result: string): Promise<void> {
  const client = _createClient();
  const deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    throw new Error("No device id! You must configure benchy first.");
  }
  const request = client.putItem({
    TableName: "benchy-dynamo",
    Item: {
      "id": { S: uid() },
      "deviceId": { S: deviceId },
      "test": { S: testName },
      "result": { S: result }
    }
  });
  await request.promise();
}
