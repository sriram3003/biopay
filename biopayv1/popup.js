let activate = document.getElementById("activate");
console.log("chrome extension go");
var imgcheck= 0;
// Clock of the icon activates the 
activate.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
     
    let a = chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: enableActivation,
    });
    // chrome.action.setIcon({path: "/images/Active.PNG", tabId:tab.id});   
  });

  // The body of this function will be executed as a content script inside the
  // current page
  async function enableActivation() {
    const api_url = 'http://localhost:3000/users';
    const response = await fetch(api_url);
	const data = await response.json();
	//console.log(data);

  let tagArr = document.getElementsByTagName("input");
  for (let i = 0; i < tagArr.length; i++) {
    tagArr[i].autocomplete = 'on';
    //console.log(tagArr)
  }
  
	//console.log(data.length);
    if (data.length > 1)
    {
        var tenure = prompt("You have" +data.length+ "cards . Choose which card you want" );
        
  
        document.getElementById('pas_ccnum').value = data[tenure-1].cardNumber;
        document.getElementById('pas_expiry').value = ""+data[tenure-1].month+"/"+data[tenure-1].year
        document.getElementById('pas_cccvc').value = data[tenure-1].cvv;
        document.getElementById('pas_ccname').value = data[tenure-1].cardName;  
                                                                                  
                                                                                 


        //document.getElementById('frmCCCVC').value = data[tenure-1].cvv;
        imgcheck=1;
        //document.getElementById('activate').src='/images/Active.PNG'
        //console.log(imgcheck)
		
    }
	else 
//	document.getElementById('frmNameCC').value = data[0].cardTitle;
    {
      document.getElementById('pas_ccnum').value = data[0].cardNumber;
      document.getElementById('pas_expiry').value = ""+data[0].month+"/"+data[0].year
      document.getElementById('pas_cccvc').value = data[0].cvv;
      document.getElementById('pas_ccname').value = data[0].cardName;  
      imgcheck=1;
    }
    //document.getElementById('frmCCCVC').value = data[0].cvv;
    //document.getElementById('frmCCExp').value = data[0].cardTitle;
    // document.getElementById('activate').src  = '/images/Active.PNG'
  }
