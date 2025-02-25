document.addEventListener("DOMContentLoaded", () => {
    const downloadList = document.getElementById("downloadList");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    chrome.runtime.sendMessage({ action: "getDownloadHistory" }, (response) => {
        const history = response.history || [];

        if (history.length === 0) {
            downloadList.innerHTML = "<li>No downloads yet.</li>";
        } else {
            history.forEach(url => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = url;
                link.textContent = "Download";
                link.target = "_blank";
                listItem.appendChild(link);
                downloadList.appendChild(listItem);
            });
        }
    });

    clearHistoryBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "clearDownloadHistory" }, () => {
            downloadList.innerHTML = "<li>No downloads yet.</li>";
        });
    });
});
