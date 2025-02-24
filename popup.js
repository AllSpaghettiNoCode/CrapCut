document.addEventListener("DOMContentLoaded", () => {
    const downloadList = document.getElementById("downloadList");

    chrome.runtime.sendMessage({ action: "getDownloadHistory" }, (response) => {
        const history = response.history || [];

        if (history.length === 0) {
            downloadList.innerHTML = "<li>No downloads here yet.</li>";
        } else {
            history.forEach(url => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = url;
                link.textContent = "Download.mp3";
                link.target = "_blank";
                listItem.appendChild(link);
                downloadList.appendChild(listItem);
            });
        }
    });
});