var jws = require('jws');

function getJwtPayload(jwt) {
  var decoded = jws.decode(jwt);
  if (!decoded) { return null; }
  var payload = decoded.payload;

  // try parse the payload
  if (typeof payload === 'string') {
    try {
      var obj = JSON.parse(payload);
      if(typeof obj === 'object') {
        payload = obj;
      }
    } catch (e) { }
  }

  return payload;
}

export default function tokenPayload(req) {
  const token = req.cookies.user_token;

  return {
    token,
    ...getJwtPayload(token)
  };
}
