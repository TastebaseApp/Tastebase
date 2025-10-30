package tastebase.api.internal;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@Tag(name = "Home", description = "Miscellaneous end points")
public class HomeController {
    @GetMapping("/")
    public String redirectToSwagger(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui.html");
        return "redirect:/swagger-ui.html";
    }

    @GetMapping("/home")
    public String home(@Parameter(hidden = true) @AuthenticationPrincipal OAuth2User principal, Model model, HttpServletResponse response) throws IOException {
        model.addAttribute("name", principal.getAttribute("name"));
        response.sendRedirect("/whoami");
        return "home";
    }

    @GetMapping("/whoami")
    public User whoAmI(@Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal, Model model, HttpServletResponse response) throws IOException {
        User user = principal.getUser();
        return user;
    }
}
