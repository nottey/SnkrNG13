const PROXY_CONFIG = [
  {
    context: ["/weatherforecast", "/api/snkr", "/api/sneakers", "/api/upcoming", "/api/sneakerimg"],
    target: "https://localhost:7157",
    secure: false
  } 

]

module.exports = PROXY_CONFIG;
