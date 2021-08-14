let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

activate.addEventListener("click", async () => {
const api_url = 'http://localhost:3000/users';
const response = await fetch(api_url);
if(response)
{
  document.getElementById('activate').src='/images/Active.PNG'
}
});