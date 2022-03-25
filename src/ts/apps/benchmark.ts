import { getDatabase } from "../database";
import { all } from "../tests/suites";
import { sleep, versionRibbon } from "../util";

const tests = all;

const runButton = document.querySelector("#runButton")!;

async function run(): Promise<void> {
  const lockIcon = document.createElement("div");
  lockIcon.innerText = "🔒";
  lockIcon.style.display = "none";
  lockIcon.style.position = "absolute";
  lockIcon.style.right = "10px";
  lockIcon.style.bottom = "10px";
  document.body.appendChild(lockIcon);

  let lock: any;
  
  try {
    lock = await (navigator as any)["wakeLock"].request();
    lockIcon.style.display = "block";
  } catch (e) {
    console.error("Error acquiring wake lock", e);
  }

  runButton.remove();

  const countdown = document.createElement("div");
  document.body.appendChild(countdown);
  countdown.innerText = "3...";
  await sleep(1);
  countdown.innerText = "2...";
  await sleep(1);
  countdown.innerText = "1...";
  await sleep(1);
  countdown.remove();

  const testNames = Object.keys(tests);
  // testNames.sort((a, b) => a.localeCompare(b));

  const db = getDatabase();

  for (const testName of testNames) {
    console.log("Test:", testName);

    const testFunction = (tests as any)[testName];
    const result = await testFunction();
    db.saveResult(testName, "fps", result);

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  }

  document.body.appendChild(document.createTextNode("Benchmark completed. Thank you!"));

  const reload = document.createElement("button");
  reload.innerText = "Reload";
  reload.addEventListener("click", () => {
    location.reload();
  });
  document.body.appendChild(reload);

  if (lock) {
    lock.release();
    lock = null;
    lockIcon.style.display = "none";
  }
}



if (localStorage.getItem("deviceId")) {
  runButton.addEventListener("click", run);
} else {
  location.href = "/configure.html";
}

versionRibbon();