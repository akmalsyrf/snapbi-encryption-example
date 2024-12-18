const jwt = require('jsonwebtoken')
const { secretPkcs8 } = require('./config')

const exp = Math.floor(Date.now() / 1000) + 180

function generateToken(data) {
  return jwt.sign(data, secretPkcs8, {
    algorithm: "RS256",
  })
}

module.exports = async (req, res) => {
    if (req.body && req.body.grantType && req.body.grantType === 'client_credentials') {
      try {
        // TODO: put client payment method real data
        const tokens = generateToken({ ...req.body, exp })

        if (tokens === false || !tokens) {
          res.status(400).json({
            responseCode: `${400}7300`,
            responseMessage: 'Unauthorized Client'
          })
        }

        if (tokens.length > 0) {
          res.status(200).json({
            accessToken: tokens,
            tokenType: 'Bearer',
            expiresIn: exp,
          })
        }
      } catch (err) {
        console.error("Err: ", err)
        res.status(400).json({
          responseCode: `${400}7300`,
          responseMessage: 'Unauthorized Client'
        })
      }
    } else {
      res.status(400).json({
        responseCode: `${400}7301`,
        responseMessage: 'Invalid Field Format'
      })
    }
}