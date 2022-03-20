import myFirstTest from "../tests/myFirstTest";
import mySecondTest from "../tests/mySecondTest";
import { runTests } from "../util";

console.log("benchmark!");

runTests([
  myFirstTest,
  mySecondTest
]);