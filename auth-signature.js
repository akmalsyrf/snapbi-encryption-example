const CryptoJS = require('crypto-js');
const { briKey } = require('./config');

const getPath = (url) => {
  // eslint-disable-next-line no-useless-escape
  const pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
  const result = url.match(pathRegex);
  return result && result.length > 1 ? result[1] : '';
}

module.exports = async (req, res, next) => {
  const { method } = req;
  const partnerId = req.headers['x-partner-id'] || undefined;
  const timestamp = req.headers['x-timestamp'] || undefined;
  const signature = req.headers['x-signature'] || undefined;
  const accessToken = req.headers.authorization.replace('Bearer ', '') || undefined;
  const endpointUrl = getPath(req.url)
  const urlCode = req.url === '/inquiry' ? '24' : '25'

  const decryptedKey = Buffer.from(partnerId, 'base64').toString();
  const splitKey = decryptedKey.split(':');
  if (splitKey[0] !== briKey.publicKey || splitKey[1] !== briKey.privateKey) {
    return res.status(400).send({
      responseCode: `${400}${urlCode}00`,
      responseMessage: 'Unauthorized.'
    })
  }

  const hash = CryptoJS.SHA256(JSON.stringify(req.body), null, 0);

  const stringToSign = `${method}:${endpointUrl}:${accessToken}:${hash.toString(CryptoJS.enc.Hex)}:${timestamp}`;
  const hmacSignature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(stringToSign, briKey.clientSecret));

  console.log('Signature BRI Auth', signature.toLowerCase())
  console.log('HMAC Signature BRI Auth', hmacSignature.toLowerCase())

  if (hmacSignature.toLowerCase() !== signature.toLowerCase()) {
    return res.status(401).send({
      responseCode: `${401}${urlCode}01`,
      responseMessage: 'Invalid Token (B2B)'
    })
  }

  return next();
}
