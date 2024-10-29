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
    
    document.body.removeEventListener('mouseover', highlightElement);
    document.body.removeEventListener('click', selectElement);
    
    // Send the selected text back to the background script
    chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
  }
}
