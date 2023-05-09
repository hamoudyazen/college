function getIP() {
  return fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(data => {
      console.log(`Your IP address is ${data.ip}`);
      return data.ip;
    })
    .catch(error => console.error(error));
}
