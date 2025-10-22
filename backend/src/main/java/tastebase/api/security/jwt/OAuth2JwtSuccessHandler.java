package tastebase.api.security.jwt;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2JwtSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final HttpSessionRequestCache requestCache = new HttpSessionRequestCache();

    public OAuth2JwtSuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        String email;
        if (authentication.getPrincipal() instanceof OAuth2User) {
            email = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
        } else if (authentication.getPrincipal() instanceof OidcUser) {
            email = ((OidcUser) authentication.getPrincipal()).getEmail();
        } else {
            email = authentication.getName();
        }

        String token = jwtUtil.generateToken(email);

        SavedRequest savedRequest = requestCache.getRequest(request, response);
        String redirectUri = (savedRequest != null) ? savedRequest.getRedirectUrl() : "/";

        String redirectWithToken = UriComponentsBuilder.fromUriString(redirectUri)
                .replaceQueryParam("token", token)
                .build()
                .toUriString();

        response.sendRedirect(redirectWithToken);
    }
}
