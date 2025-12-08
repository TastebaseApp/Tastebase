package tastebase.api.security.jwt;

import io.jsonwebtoken.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtLogoutHandler implements LogoutHandler {
    private final JwtUtil jwtUtil;

    public JwtLogoutHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) return;

        String token = header.substring(7);
        if (jwtUtil.validateToken(token)) {
            jwtUtil.blacklist(token);
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            try {
                response.getWriter().write("{\"message\": \"Logged out successfully\"}");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            try {
                response.getWriter().write("{\"error\": \"Token invalid\"}");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
