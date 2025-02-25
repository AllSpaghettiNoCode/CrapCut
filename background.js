let lastMediaUrl = "";

chrome.webRequest.onCompleted.addListener(
  (details) => {

    const isMediaRequest = details.responseHeaders.some(header => header.name.toLowerCase() === 'content-type' && header.value.includes('audio/'));

    const isPartialContent = details.statusCode === 206;

    if (isMediaRequest || isPartialContent) {
      console.log("Media url found:", details.url);
      lastMediaUrl = details.url;

      chrome.storage.local.get({ downloadHistory: [] }, (data) => {
        let history = data.downloadHistory || [];
        if (!history.includes(details.url)) {
          history.unshift(details.url);
          history = history.slice(0, 10);
          chrome.storage.local.set({ downloadHistory: history });
        }
      })

      chrome.storage.local.set({ lastMediaUrl }, () => {
        console.log("Saved url:", lastMediaUrl);
      });
    }
  },
  { urls: ["https://v16-cc.capcut.com/*"] },
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
      sendResponse({ success: true, history: data.downloadHistory || [] });
    });
    return true;
  } else if (message.action === "clearDownloadHistory") {
    chrome.storage.local.set({ downloadHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
