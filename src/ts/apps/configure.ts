const accessKeyId = localStorage.getItem("accessKeyId") || "";
const secretAccessKey = localStorage.getItem("secretAccessKey") || "";
const deviceId = localStorage.getItem("deviceId") || "";

const accessKeyIdInput = document.querySelector("#accessKeyId") as HTMLInputElement;
accessKeyIdInput.value = accessKeyId;

const secretAccessKeyInput = document.querySelector("#secretAccessKey") as HTMLInputElement;
secretAccessKeyInput.value = secretAccessKey;

const deviceIdInput = document.querySelector("#deviceId") as HTMLInputElement;
deviceIdInput.value = deviceId;

const applyButton = document.querySelector("#applyButton") as HTMLButtonElement;
applyButton.addEventListener("click", () => {
  localStorage.setItem("accessKeyId", accessKeyIdInput.value);
  localStorage.setItem("secretAccessKey", secretAccessKeyInput.value);
  localStorage.setItem("deviceId", deviceIdInput.value);

  location.href = "/benchmark.html";
});