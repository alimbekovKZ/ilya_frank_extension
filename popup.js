document.getElementById('selectTextBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: enableTextSelection
    });
  });
});

function enableTextSelection() {
  document.body.addEventListener('mouseover', highlightElement);
  document.body.addEventListener('click', selectElement);
  
  function highlightElement(event) {
    event.target.style.border = '2px solid blue';
    event.target.addEventListener('mouseout', () => {
      event.target.style.border = '';
    }, { once: true });
  }

  function selectElement(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const selectedText = event.target.innerText;
    console.log("Selected Text:", selectedText);
    
    // Send the selected text back to the background script
    chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
  }
}

// Add a listener for the text selected action
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "textSelected") {
    // Send the selected text to the content script to process it
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "applyIlyaFrankMethod", text: request.text });
    });
  }
});
