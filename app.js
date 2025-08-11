const methodSelect = document.getElementById('method-select');
const urlInput = document.getElementById('url-input');
const sendButton = document.getElementById('send-button');
const requestBodySection = document.getElementById('request-body-section');
const requestBodyTextarea = document.getElementById('request-body-textarea');
const responseDataPre = document.getElementById('response-data');

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const handleSendRequest = async () => {
    const url = CORS_PROXY + urlInput.value;
    const method = methodSelect.value;
    let requestBody = requestBodyTextarea.value;
    if (!urlInput.value) {
        responseDataPre.textContent = 'Please enter a valid URL.';
        return;
      }
      sendButton.textContent = 'Sending...';
      sendButton.disabled = true;
      responseDataPre.textContent = 'Loading...';
      try {
        const fetchOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
              JSON.parse(requestBody);
            } catch (e) {
              responseDataPre.textContent = 'Error: The request body is not a valid JSON string.';
              sendButton.textContent = 'Send';
              sendButton.disabled = false;
              return;
            }
            fetchOptions.body = requestBody;
          }
          const response = await fetch(url, fetchOptions);
          const textData = await response.text();
  
          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} - ${textData}`);
          }
  
          try {
            const jsonData = JSON.parse(textData);
            responseDataPre.textContent = JSON.stringify(jsonData, null, 2);
          } catch (e) {
            responseDataPre.textContent = textData;
          }
  
        } catch (error) {
          responseDataPre.textContent = `Error: ${error.message}`;
        } finally {
          sendButton.textContent = 'Send';
          sendButton.disabled = false;
        }
      };

      sendButton.addEventListener('click', handleSendRequest);

    // Add an event listener to toggle the request body section based on the method
    methodSelect.addEventListener('change', (event) => {
      if (['POST', 'PUT', 'PATCH'].includes(event.target.value)) {
        requestBodySection.classList.remove('hidden');
        // Pre-populate the textarea with a sample JSON for easier testing
        requestBodyTextarea.value = JSON.stringify({
          title: "foo",
          body: "bar",
          userId: 1
        }, null, 2);
      } else {
        requestBodySection.classList.add('hidden');
      }
    });