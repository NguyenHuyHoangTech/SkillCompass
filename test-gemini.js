const url = 'https://generativelanguage.googleapis.com/v1beta/models/model-3.6-flash:generateContent';
const key = 'AQ.Ab8RN6K3eGNHvCQlyEYxYlxxP85KfrYS5qY74djy0b5le8EeHw';

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
    },
    body: JSON.stringify({
        contents: [{ parts: [{ text: "Explain how AI works in a few words" }] }]
    })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.error(err));
