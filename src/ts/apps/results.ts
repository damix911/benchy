import { getResults } from "../storage";

async function main(): Promise<void> {
  const results = await getResults();
  
  const testNames = new Set<string>();
  for (const result of results) {
    testNames.add(result.test);
  }

  for (const testName of testNames) {
    const h2 = document.createElement("h2");
    h2.innerText = testName;
    document.body.appendChild(h2);

    
    const table = document.createElement("table");
    const header = document.createElement("tr");
    header.style.fontWeight = "bold";
    header.innerHTML = "<td>id</td><td>deviceId</td><td>userAgent</td><td>result</td>";
    table.appendChild(header);

    // TODO: Lookup, don't rescan.
    for (const result of results) {
      if (result.test === testName) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${result.id}</td><td>${result.deviceId}</td><td>${result.userAgent}</td><td>${result.result}</td>`;
        table.appendChild(row);
      }
    }

    document.body.appendChild(table);

    document.body.appendChild(document.createElement("hr"));
  }




  // document.body.appendChild(table);
}

if (localStorage.getItem("deviceId")) {
  main();
} else {
  location.href = "/configure.html";
}