const clientId = "";
const clientSecret = "";

export default {
  async fetch(request) {
  let res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
  }) 
  let resJson = await res.json();
  let twitch = await fetch(`https://api.twitch.tv/helix/streams?user_login=indiethonevents`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${resJson.access_token}`,
      'Client-Id': clientId,
    }
  })
  let twitchJson = await twitch.json();
  console.log(twitchJson)
  return new Response(JSON.stringify({
    live: (twitchJson.data.length > 0) ? true : false
  }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}