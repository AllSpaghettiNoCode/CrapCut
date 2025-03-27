let lastMediaUrl = "";

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const isPreflightRequest = details.method === "OPTIONS" && details.statusCode === 204 && details.responseHeaders.some((header) => header.name.toLowerCase() === "content-type" && header.value.includes("text/plain"));
    

    if (isPreflightRequest) {
      const newEntry = {
        url: details.url,
        timestamp: Date.now(),
      };
      console.log("Media url found:", details.url);
      lastMediaUrl = details.url;

      chrome.storage.local.get({ downloadHistory: [] }, (data) => {
        let history = data.downloadHistory || [];

        const now = Date.now();
        history = history.filter((entry) => now - entry.timestamp < 12 * 60 * 60 * 1000);
        
        if (!history.some((entry) => entry.url === details.url)) {
          history.unshift(newEntry);
          history = history.slice(0, 10);
        }

        chrome.storage.local.set({ downloadHistory: history });
      });

      chrome.storage.local.set({ lastMediaUrl }, () => {
        console.log("Saved url:", lastMediaUrl);
      });
    }
  },
  { urls: ["*://sg-gcp-media.evercloud.capcut.com/*"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMediaUrl") {
    chrome.storage.local.get("lastMediaUrl", (data) => {
      sendResponse(data.lastMediaUrl ? { success: true, url: data.lastMediaUrl } : { success: false});
    });
    return true;
  } else if (message.action === "getDownloadHistory") {
    chrome.storage.local.get("downloadHistory", (data) => {
      const now = Date.now();
      let history = data.downloadHistory || [];
      history = history.filter((entry) => now - entry.timestamp < 12 * 60 * 60 * 1000);
      chrome.storage.local.set({ downloadHistory: history });
      sendResponse({ success: true, history });
    });
    return true;
  } else if (message.action === "clearDownloadHistory") {
    chrome.storage.local.set({ downloadHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
