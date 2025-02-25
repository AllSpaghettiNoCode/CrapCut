function addDownloadButton() {
  const audioControls = document.querySelectorAll(".player-play-btn");

  audioControls.forEach((control) => {
    const parentElement = control.parentElement;
    if (parentElement.querySelector(".capcut-tts-download")) return;

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download Sample";
    downloadBtn.classList.add("capcut-tts-download");

    downloadBtn.style.padding = "5px 10px";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.backgroundColor = "#4CAF50";
    downloadBtn.style.color = "#fff";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.fontSize = "12px";
    downloadBtn.style.position = "absolute";
    downloadBtn.style.left = "-150px";
    downloadBtn.style.top = "50%";
    downloadBtn.style.transform = "translateY(-50%)";

    downloadBtn.onclick = () => {
      chrome.runtime.sendMessage({ action: "getMediaUrl" }, (response) => {
        if (response && response.success) {
          window.open(response.url, "_blank");
        } else {
          alert("No audio found. Please preview the audio first.");
        }
      });
    };

    parentElement.style.position = "relative";
    parentElement.appendChild(downloadBtn);
  });
}

setInterval(addDownloadButton, 1000);
