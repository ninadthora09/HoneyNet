const axios = require("axios");

async function getGeo(ip) {

  try {

    const res = await axios.get(
      `http://ip-api.com/json/${ip}`
    );

    const data = res.data;

    return {
      country: data.country || "Unknown",
      city: data.city || "Unknown",
      lat: data.lat || 0,
      lng: data.lon || 0,
    };

  } catch (err) {

    return {
      country: "Unknown",
      city: "Unknown",
      lat: 0,
      lng: 0,
    };

  }

}

module.exports = {
  getGeo,
};