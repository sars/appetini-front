import jws from 'jws';

function getJwtPayload(jwt) {
  const decoded = jws.decode(jwt);
  if (!decoded) { return null; }
  let payload = decoded.payload;

  // try parse the payload
  if (typeof payload === 'string') {
    try {
      const obj = JSON.parse(payload);
      if (typeof obj === 'object') {
        payload = obj;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return payload;
}

export default function tokenPayload(encodedToken) {
  return {
    encodedToken,
    ...getJwtPayload(encodedToken)
  };
}
