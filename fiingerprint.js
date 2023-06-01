// Get the domain name from the current URL
const domainName = window.location.origin;

// Generate a random hexadecimal string
function generateRandomHex(length) {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Replace numbers and letters with random hexadecimal values every 100 milliseconds
const intervalId = setInterval(() => {
  const hexValue = generateRandomHex(40);
  const newURL = `${domainName}/${hexValue}`;
  window.history.pushState({}, document.title, newURL);
  document.getElementById("FPsum").textContent = hexValue;
}, 100);

// Clear the URL and HTML element after 2 seconds
setTimeout(() => {
  clearInterval(intervalId);
  window.history.pushState({}, document.title, domainName);
  document.getElementById("FPsum").textContent = "";
}, 2000);


function changeurl() {

  let newURL = '/finger-print/';

  // Change the URL back to normal
  window.history.pushState({}, '', newURL);

}
//----------------------------------------------------------------

// Delayed script
function delayedScript() {

  changeurl()

  async function calculateBrowserFingerprint() {
    // User Agent
    const userAgent = navigator.userAgent;

    // Screen Properties
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenColorDepth = window.screen.colorDepth;

    // Timezone Offset
    const timezoneOffset = new Date().getTimezoneOffset();

    // Available Fonts
    const availableFonts = [];
    const fontList = ['Arial', 'Arial Black', 'Arial Unicode MS', 'Courier New', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < fontList.length; i++) {
      ctx.font = "72px sans-serif";
      ctx.fillText('a', 0, 100);
      ctx.font = "72px '" + fontList[i] + "', sans-serif";
      ctx.fillText('a', 0, 200);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      if (data[3] !== 0) {
        availableFonts.push(fontList[i]);
      }
    }

    // Language
    const language = navigator.language;

    // Hardware Concurrency
    const hardwareConcurrency = navigator.hardwareConcurrency;

    // Concatenate fingerprint components
    const fingerprint = userAgent + screenWidth + screenHeight + screenColorDepth + timezoneOffset + availableFonts.join(',') + language + hardwareConcurrency;

    // Hash the fingerprint using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  // Calculate and print the hashed browser fingerprint
  calculateBrowserFingerprint().then(hash => {
    console.log(hash);
    const fingerprintElement = document.getElementById('FPsum');
    fingerprintElement.textContent = hash;
  });


}

// Delay the execution of the script by 2 seconds
setTimeout(delayedScript, 2000);
