import myFirstTest from "../tests/myFirstTest";
import mySecondTest from "../tests/mySecondTest";
import { runTests } from "../util";

runTests([
  myFirstTest,
  mySecondTest
]);