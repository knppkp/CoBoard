chrome.action.onClicked.addListener((tab) => {
    // Replace with the URL of your React app
    const reactAppUrl = "http://localhost:3000";
    
    // Open the URL in a new tab
    chrome.tabs.create({ url: reactAppUrl });
  });