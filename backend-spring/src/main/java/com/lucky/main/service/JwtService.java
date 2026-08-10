package com.lucky.main.service;

import com.lucky.main.entity.RefreshToken;
import com.lucky.main.entity.User;
import com.lucky.main.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class JwtService {


    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${security.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Value("${security.jwt.issuer}")
    private String issuer;

    @Value("${security.jwt.audience}")
    private String audience;

    private final RefreshTokenRepository refreshTokenRepository;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateAccessToken(new HashMap<>(), userDetails);
    }

    public String generateAccessToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, accessTokenExpiration);
    }


    public String generateAccessToken(UserDetails userDetails, User user) {
        Map<String, Object> extraClaims = buildUserClaims(userDetails, user);
        return generateAccessToken(extraClaims, userDetails);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("jti", UUID.randomUUID().toString());  // Unique ID for revocation
        return buildToken(claims, userDetails, refreshTokenExpiration);
    }

    public void deleteRefreshToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }


    // Create + Save + Return refresh token "ROTATION SAFE"
    public String createRefreshToken(User user) {

        // Remove old tokens of this user
        refreshTokenRepository.deleteByUserId(user.getId());

        // Build UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(
                        user.getRoles()
                                .stream()
                                .map(role -> "ROLE_" + role.name())
                                .toArray(String[]::new)
                )
                .build();

        // Generate new refresh token
        String refreshToken = generateRefreshToken(userDetails, user);

        // Save to DB
        saveRefreshToken(user, refreshToken);

        return refreshToken;
    }

    public String generateRefreshToken(UserDetails userDetails, User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("jti", UUID.randomUUID().toString());
        extraClaims.put("userId", user.getId());
        return buildToken(extraClaims, userDetails, refreshTokenExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) //email id
                .setIssuer(issuer)
                .setAudience(audience)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Map<String, Object> buildUserClaims(UserDetails userDetails, User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        // From UserDetails: roles/authorities
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        extraClaims.put("roles", roles);

        // From User entity: Add user details (customize based on your User fields)
        extraClaims.put("userId", user.getId());
        extraClaims.put("fullName", user.getFirstName() + " " + user.getLastName());
        extraClaims.put("phoneNumber", user.getPhoneNumber());

        return extraClaims;
    }


//    public boolean isTokenValid(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
//    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        Claims claims = extractAllClaims(token);

        return claims.getSubject().equals(userDetails.getUsername())
                && claims.getIssuer().equals(issuer)
                && claims.getAudience().equals(audience)
                && !isTokenExpired(token);
    }


    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

//    private Claims extractAllClaims(String token) {
//        return Jwts
//                .parserBuilder()
//                .setSigningKey(getSignInKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }

    public Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void saveRefreshToken(User user, String refreshToken) {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .build();
        refreshTokenRepository.save(token);
    }

    public Optional<RefreshToken> findRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public void deleteRefreshTokenByUser(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());
    }

    public Long extractUserId(String token) {
        return extractClaim(token,
                claims -> ((Number) claims.get("userId")).longValue());
    }
}
