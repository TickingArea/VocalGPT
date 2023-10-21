const recognitionElement = document.getElementById('recognition');
const start = document.getElementById('start');
const stopbutton = document.getElementById('stop');
const speechRadio = document.getElementById('speech');
const messageInput = document.getElementById('message');
const sendbutton = document.getElementById('send-button');

start?.addEventListener('click', () => {
    st();
})

let recognitionflag = false;
const recognition = new webkitSpeechRecognition();
stopbutton?.addEventListener('click', () => {
    recognitionflag = true;
    recognition.stop();
})

function st() {
    if ('webkitSpeechRecognition' in window) {
        recognition.continuous = true;
        recognition.lang = 'ja-JP';

        recognition.onresult = (event) => {
            const result = event.results[event.resultIndex];
            const transcript = result[0].transcript;
            if (transcript !== '') {
                const messagediv = document.createElement('div');
                messagediv.setAttribute('class', 'd-flex justify-content-end messaged');
                const ul = document.createElement('ul');
                const ol = document.createElement('ol');
                ol.setAttribute('class', 'text-end');
                const timestampspan = document.createElement('span');
                timestampspan.setAttribute('class', 'timestamp');
                timestampspan.innerText = `${new Date().toLocaleString()}`;
                const ol2 = document.createElement('ol');
                ol2.setAttribute('class', 'text-end');
                const messagep = document.createElement('p');
                messagep.setAttribute('class', 'messagep btn rounded-3 px-2 text-end');
                messagep.innerText = `${transcript}`;
                recognitionElement.appendChild(messagediv);
                messagediv.appendChild(ul);
                ul.appendChild(ol);
                ol.appendChild(timestampspan);
                ul.appendChild(ol2);
                ol2.appendChild(messagep);

                // chatgpt
                const messagedivres = document.createElement('div');
                messagedivres.setAttribute('class', 'd-flex messaged');
                const ulres = document.createElement('ul');
                const olres = document.createElement('ol');
                const timestampspanres = document.createElement('span');
                timestampspanres.setAttribute('class', 'timestamp');
                timestampspanres.innerText = `gpt-3.5-turbo-16k, ${new Date().toLocaleString()}`;
                const ol2res = document.createElement('ol');
                const messagepres = document.createElement('p');
                messagepres.setAttribute('class', 'messagep btn rounded-3 px-2 text-start');
                fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: transcript })
                })
                    .then(response => {
                        if (!response.ok) {
                            messagepres.innerText = `${response.status} ${response.statusText}`;
                            recognitionElement.appendChild(messagedivres);
                            messagedivres.appendChild(ulres);
                            ulres.appendChild(olres);
                            olres.appendChild(timestampspanres);
                            ulres.appendChild(ol2res);
                            ol2res.appendChild(messagepres);
                        }
                        return response.json();
                    })
                    .then(data => {
                        data = data.replace(/"/g, '');
                        messagepres.innerText = `${data}`;
                        recognitionElement.appendChild(messagedivres);
                        messagedivres.appendChild(ulres);
                        ulres.appendChild(olres);
                        olres.appendChild(timestampspanres);
                        ulres.appendChild(ol2res);
                        ol2res.appendChild(messagepres);

                        if ('speechSynthesis' in window && speech.checked) {
                            const speechSynthesis = window.speechSynthesis;
                            const utterance = new SpeechSynthesisUtterance();
                            utterance.text = data;
                            utterance.lang = 'ja-JP';
                            speechSynthesis.speak(utterance);
                        }
                    })
                    .catch(e => {
                        console.error(e);
                    })
            }
        }

        recognition.onend = (e) => {
            if (!recognitionflag) {
                st();
            } else {
                recognitionflag = false;
            }
        }

        recognition.start();
    } else {
        console.error('Web Speech API not supported in this browser');
    }
}