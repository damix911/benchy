export function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function versionRibbon(): void {
  const ribbon = document.createElement("div");
  ribbon.style.padding = "1em";
  ribbon.style.font = "12px monospace";
  ribbon.style.position = "absolute";
  ribbon.style.right = "10px";
  ribbon.style.top = "10px";
  ribbon.style.border = "1px solid black";

  switch (location.hostname) {
    case "lighthearted-paprenjak-dfe049.netlify.app":
      ribbon.style.backgroundColor = "orange";
      ribbon.style.color = "white";
      ribbon.innerText = "branch: devel";
      break;
    case "nervous-wiles-aff2a1.netlify.app":
      ribbon.style.backgroundColor = "green";
      ribbon.style.color = "white";
      ribbon.innerText = "branch: main";
      break;
    case "localhost":
      ribbon.style.backgroundColor = "blue";
      ribbon.style.color = "white";
      ribbon.innerText = "(local)";
      break;
  }

  document.body.appendChild(ribbon);
}