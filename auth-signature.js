const CryptoJS = require('crypto-js');
const { snapKey } = require('./config');

module.exports = async (req, res, next) => {
  const { method } = req;
  const partnerId = req.headers['x-partner-id'] || undefined;
  const timestamp = req.headers['x-timestamp'] || undefined;
  const signature = req.headers['x-signature'] || undefined;
  const accessToken = (req.headers.authorization && req.headers.authorization.replace('Bearer ', '')) || undefined;
  const endpointUrl = req.url
  const urlCode = req.url === '/inquiry' ? '24' : '25'

  if (partnerId && timestamp && signature && accessToken) {
    const decryptedKey = Buffer.from(partnerId, 'base64').toString();
    const splitKey = decryptedKey.split(':');

    if (splitKey[0] !== snapKey.secret || splitKey[1] !== snapKey.public) {
      return res.status(400).send({
        responseCode: `${400}${urlCode}00`,
        responseMessage: 'Unauthorized.'
      })
    }
  
    const hash = CryptoJS.SHA256(JSON.stringify(req.body), null, 0);
  
    const stringToSign = `${method}:${endpointUrl}:${accessToken}:${hash.toString(CryptoJS.enc.Hex)}:${timestamp}`;
    const hmacSignature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(stringToSign, snapKey.secret));
  
    console.log('Signature Auth', signature.toLowerCase())
    console.log('HMAC Signature Auth', hmacSignature.toLowerCase())
  
    if (hmacSignature.toLowerCase() !== signature.toLowerCase()) {
      return res.status(401).send({
        responseCode: `${401}${urlCode}01`,
        responseMessage: 'Invalid Token (B2B)'
      })
    }
  
    return next();
  } else {
    return res.status(401).send({
      responseCode: `${401}${urlCode}01`,
      responseMessage: 'Invalid Token (B2B)'
    })
  }
}
