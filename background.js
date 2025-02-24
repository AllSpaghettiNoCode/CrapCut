let lastMediaUrl = "";

chrome.webRequest.onCompleted.addListener(
  (details) => {

    const isMediaRequest = details.responseHeaders.some(header => header.name.toLowerCase() === 'content-type' && header.value.includes('audio/'));

    const isPartialContent = details.statusCode === 206;

    if (isMediaRequest || isPartialContent) {
      console.log("Media url found:", details.url);
      lastMediaUrl = details.url;
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
      if (data.lastMediaUrl) {
        sendResponse({ success: true, url: data.lastMediaUrl });
      } else {
        sendResponse({ success: false });
      }
    });
    return true;
  }
})