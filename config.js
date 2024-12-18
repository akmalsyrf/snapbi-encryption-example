const { join } = require('path')
const { existsSync, readFileSync } = require('fs')
const dir = join(__dirname, 'certificates');
const { env: parsed } = process

/** Private certificate used for signing JSON WebTokens */
const PRIVATE_KEY = parsed.PRIVATE_KEY || join(dir, 'private.key')
const SECRET = existsSync(PRIVATE_KEY) ? readFileSync(PRIVATE_KEY) : PRIVATE_KEY;

/** Private certificate used for signing JSON WebTokens */
const PRIVATE_PKCS8_KEY = parsed.PRIVATE_PKCS8_KEY || join(dir, 'private.pkcs8.key')
const SECRET_PKCS8 = existsSync(PRIVATE_PKCS8_KEY) ? readFileSync(PRIVATE_PKCS8_KEY) : PRIVATE_PKCS8_KEY;

/** Public certificate used for verification.  Note: you could also use the private key */
const PUBLIC_KEY = parsed.PUBLIC_KEY || join(dir, 'public.key')
const PUBLIC = existsSync(PUBLIC_KEY) ? readFileSync(PUBLIC_KEY) : PUBLIC_KEY;

module.exports = {
    public: PUBLIC,
    secret: SECRET,
    secretPkcs8: SECRET_PKCS8,
    snapKey: {
        secret: "0qS7jMYVe6gosDAK",
        public: "dVZKovKyYbLSElg9",
    },
}