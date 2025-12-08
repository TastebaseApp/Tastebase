package tastebase.api.internal;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/login")
@Tag(name = "Login", description = "Endpoints for logging in")
public class LoginController {

    @GetMapping("/google")
    public void redirectToGoogle(HttpServletRequest request, HttpServletResponse response, @RequestParam("redirect_uri") String redirectUri) throws IOException {
        request.getSession().setAttribute("frontend_redirect_uri", redirectUri);
        response.sendRedirect("/oauth2/authorization/google");
    }

}
