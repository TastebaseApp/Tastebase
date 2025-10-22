package tastebase.api.security;

import com.nimbusds.jwt.JWT;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.AeadAlgorithm;
import io.jsonwebtoken.security.KeyBuilder;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecretKeyBuilder;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import tastebase.Config;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey KEY;
    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 1 Day

    public JWTUtil() {
        byte[] keyBytes = Base64.getDecoder().decode(Config.get("jwt.key"));
        KEY = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(KEY)
                .compact();
    }

    public String extractEmail(String token){
        Claims claims = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token){
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(KEY)
                    .build()
                    .parseSignedClaims(token).getPayload();

            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
