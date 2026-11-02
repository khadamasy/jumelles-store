import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const keycloakUrl = process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080';
const realm = process.env.KEYCLOAK_REALM || 'jumelles-store';

export const jwksClient = jwksRsa({
  jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

export function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

