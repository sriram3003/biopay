console.log("chrome extension go");
const api_url = 'http://localhost:3000/users';
async function getISS() {
	const response = await fetch(api_url);
	const data = await response.json();
	console.log(data);
	console.log(data.length)
	console.log(data[0].cardTitle);
	
	for (i=0; i<data.length; i++)
	{
		//chrome.browserAction.setPopup({popup: "/popup.html"});
		document.getElementById('field1').value = data[4].cardTitle;
	}
	// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	// 	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
	// 	  console.log(response.farewell);
	// 	});
	//   });
	
}

getISS();

// function gotPopup(popupURL) {
//     console.log(popupURL)
//   }
  
//   var gettingPopup = chrome.browserAction.getPopup({});
//   gettingPopup.then(gotPopup); 