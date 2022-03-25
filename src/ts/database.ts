import AWS from "aws-sdk";
import { uid } from "uid";
import { IDatabase, IResultEntry } from "./types";

AWS.config.update({ region: "us-west-1" })

function _getTableName(): string {
  if (location.hostname === "localhost") {
    return "benchy.local.results";
  }

  return `${location.hostname}.results`;
}

function _createDynamoClient(): AWS.DynamoDB {
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

export function getDatabase(): IDatabase {
  return new DynamoDatabase();
}

export class DynamoDatabase implements IDatabase {
  async saveResult(testName: string, resultFormat: string, result: string): Promise<void> {
    const client = _createDynamoClient();
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      throw new Error("No device id! You must configure benchy first.");
    }
    const TableName = _getTableName();
    const request = client.putItem({
      TableName,
      Item: {
        "id": { S: uid() },
        "deviceId": { S: deviceId },
        "userAgent": { S: navigator.userAgent },
        "test": { S: testName },
        "resultFormat": { S: resultFormat },
        "result": { S: result },
        "date": { S: Date.now().toString() }
      }
    });
    await request.promise();
  }
  
  
  getResults(): Promise<IResultEntry[]> {
    const client = _createDynamoClient();
    
    return new Promise((resolve) => {
      const TableName = _getTableName();
      client.scan({
        TableName
      }, (err, data) => {
        if (err) {
          throw new Error("Error fetching the results.");
        }
  
        // TODO: Continue scanning.
  
        resolve((data as any).Items.map((item: any) => ({
          "id": item.id.S,
          "deviceId": item.deviceId.S,
          "userAgent": item.userAgent.S,
          "test": item.test.S,
          "resultFormat": item.resultFormat.S,
          "result": item.result.S,
          "date": item.date.S
        })));
      });
    });
  }
}









// export async function listTables(): Promise<string[]> {
//   const client = _createClient();
//   const request = client.listTables({});
//   const response = await request.promise();
//   return response.TableNames || [];
// }


