export interface IResultEntry {
  id: string;
  deviceId: string;
  userAgent: string;
  test: string;
  resultFormat: string;
  result: string;
  date: number;
}
export interface IDatabase {
  saveResult(testName: string, resultFormat: string, result: string): Promise<void>;
  getResults(): Promise<IResultEntry[]>;
}
