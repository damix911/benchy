import { saveResult } from "../storage";
import { all } from "../tests/suites";

const tests = all;

const runButton = document.querySelector("#button")!;

async function run(): Promise<void> {
  runButton.remove();
  
  const testNames = Object.keys(tests);
  // testNames.sort((a, b) => a.localeCompare(b));

  for (const testName of testNames) {
    console.log("Test:", testName);

    const testFunction = (tests as any)[testName];
    const result = await testFunction();
    saveResult(testName, result);

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  }

  document.body.appendChild(document.createTextNode("Benchmark completed. Thank you!"));
}

runButton.addEventListener("click", run);
