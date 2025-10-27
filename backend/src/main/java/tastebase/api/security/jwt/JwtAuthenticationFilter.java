package tastebase.api.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import tastebase.database.UserDAO;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            logger.debug("No Bearer token found in Authorization header for request: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        logger.debug("Processing JWT: {} for request: {}", token, request.getRequestURI());

        try {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                logger.debug("Extracted email from JWT: {}", email);
                User user = UserDAO.findByEmail(email);
                if (user != null) {
                    logger.debug("Found user: id={}, email={}, name={}", user.getID(), user.getEmail(), user.getName());
                    Map<String, Object> attributes = new HashMap<>();
                    attributes.put("sub", email);
                    attributes.put("email", user.getEmail());
                    attributes.put("name", user.getName() != null ? user.getName() : "");
                    attributes.put("provider", user.getProvider() != null ? user.getProvider() : "");
                    attributes.put("provider_id", user.getProviderID() != null ? user.getProviderID() : "");
                    UserPrincipal principal = new UserPrincipal(user, attributes);
                    var authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set for user: {}", email);
                } else {
                    logger.warn("No user found for email: {}", email);
                    throw new AuthenticationException("User not found for email: " + email) {};
                }
            } else {
                logger.warn("Invalid or blacklisted JWT token: {}", token);
                throw new AuthenticationException("Invalid JWT token") {};
            }
        } catch (AuthenticationException e) {
            logger.error("Authentication failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
            return;
        }
        filterChain.doFilter(request, response);
    }
}
