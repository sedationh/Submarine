export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  main() {
    console.log("YouTube Subtitle Position Controller loaded");

    // Function to check if captions are enabled
    function isCaptionsEnabled() {
      const captionButton = document.querySelector(".ytp-subtitles-button");
      if (captionButton) {
        return captionButton.getAttribute("aria-pressed") === "true";
      }
      return false;
    }

    // Function to enable captions
    function enableCaptions() {
      const captionButton = document.querySelector(
        ".ytp-subtitles-button"
      ) as HTMLElement;
      if (captionButton && !isCaptionsEnabled()) {
        captionButton.click();
        console.log("Captions enabled automatically");
      }
    }

    // Function to set the captions to the custom position
    function setCustomPosition() {
      // Enable captions first if not enabled
      enableCaptions();

      // YouTube native captions
      const captionContainer = document.getElementById(
        "ytp-caption-window-container"
      );
      if (captionContainer) {
        captionContainer.style.position = "fixed";
      }
      
      // Add CSS to remove margin-bottom from caption window
      const styleId = 'submarine-caption-style';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = `
        .caption-window.ytp-caption-window-bottom {
          margin-bottom: 0 !important;
        }
      `;
      
      const divBelow = document.getElementById("below");
      if (divBelow) {
        divBelow.style.marginTop = "240px";
      }
    }

    // Function to reset the captions to the default position
    function setDefaultPosition() {
      // YouTube native captions
      const captionContainer = document.getElementById(
        "ytp-caption-window-container"
      );
      if (captionContainer) {
        captionContainer.style = ""; // Clear inline styles
      }

      // Remove custom CSS style
      const styleElement = document.getElementById('submarine-caption-style') as HTMLStyleElement;
      if (styleElement) {
        styleElement.remove();
      }

      // Reset below content margin
      const divBelow = document.getElementById("below");
      if (divBelow) {
        divBelow.style.marginTop = ""; // Clear inline styles
      }
    }

    function checkAndAdjustStyles() {
      const captionContainer = document.getElementById(
        "ytp-caption-window-container"
      );
      const divBelow = document.getElementById("below");
      if (captionContainer && divBelow) {
        if (window.getComputedStyle(captionContainer).position !== "fixed") {
          // If the caption container is not fixed, reset the margin of the 'below' div
          divBelow.style.marginTop = "";
        }
      }
    }

    // Function to monitor caption status and auto-enable if needed
    function monitorCaptions() {
      // Check if we're on a video page
      const videoPlayer = document.querySelector(".html5-video-player");
      if (videoPlayer && !isCaptionsEnabled()) {
        // Wait a bit for the page to fully load, then enable captions
        setTimeout(() => {
          enableCaptions();
        }, 2000);
      }
    }

    // Listen for messages from popup
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "setCustom") {
        setCustomPosition();
        sendResponse({ success: true, position: "custom" });
      } else if (message.action === "setDefault") {
        setDefaultPosition();
        sendResponse({ success: true, position: "default" });
      } else if (message.action === "checkCaptions") {
        const enabled = isCaptionsEnabled();
        sendResponse({ success: true, captionsEnabled: enabled });
      } else if (message.action === "enableCaptions") {
        enableCaptions();
        sendResponse({ success: true, captionsEnabled: isCaptionsEnabled() });
      }
    });

    // Monitor for caption status changes
    setInterval(monitorCaptions, 3000); // Check every 3 seconds
    setInterval(checkAndAdjustStyles, 1000); // Check every second
  },
});
