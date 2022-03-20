import { saveResult } from "../storage";
import { all } from "../tests/suites";

const tests = all;

async function main(): Promise<void> {
  const testNames = Object.keys(tests);
  testNames.sort((a, b) => a.localeCompare(b));

  for (const testName of testNames) {
    const testFunction = (tests as any)[testName];
    const result = await testFunction();
    saveResult(testName, result);
  }
}

main();