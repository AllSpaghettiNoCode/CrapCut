function addDownloadButton() {
  const cardItems = document.querySelectorAll(".card-item-wrapper.attribute-card-item-new");

  cardItems.forEach((card) => {
    if (card.dataset.downloadButtonAdded) return;

    card.addEventListener("click", () => {
      console.log("Card clicked");
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download Preview";
    downloadBtn.classList.add("capcut-tts-download");

    Object.assign(downloadBtn.style, {
      padding: "5px 10px",
      cursor: "pointer",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "12px",
      marginTop: "10px",
      display: "block",
      textAlign: "center",
      width: "100%",
    });

    downloadBtn.onclick = () => {
      chrome.runtime.sendMessage({ action: "getMediaUrl" }, (response) => {
        if (response && response.success) {
            window.open(response.url, "_blank");
          } else {
            alert("No audio found. Please click on a voice first.")
          }
      });
    };

    card.appendChild(downloadBtn);
    card.dataset.downloadButtonAdded = "true";
  });
}

function trackVoiceCardClicks() {
  document.body.addEventListener("click", (event) => {
    const voiceCard = event.target.closest(".card-item-wrapper.attribute-card-item-new");
    if (voiceCard) {
      console.log("Voice card clicked!");

      fetch("https://sg-gcp-media.evercloud.capcut.com/origin/*", { method: "OPTIONS" })
        .then((response) => {
          if (response.ok) {
            const previewUrl = response.url;
            chrome.storage.local.set({ lastMediaUrl: previewUrl }, () => {
              console.log("Stored preview URL:", previewUrl);
            });
          } else {
            console.warn("Failed to fetch");
          }
        })
        .catch((error) => console.error("Error fetching url:", error));
    }
  });
}

setInterval(addDownloadButton, 1000);
trackVoiceCardClicks();
