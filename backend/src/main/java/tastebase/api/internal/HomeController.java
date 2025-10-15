package tastebase.api.internal;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class HomeController {
    @GetMapping("/")
    public String redirectToSwagger(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui.html");
        return "redirect:/swagger-ui.html";
    }

    @GetMapping("/home")
    public String home(@AuthenticationPrincipal OAuth2User principal, Model model, HttpServletResponse response) throws IOException {
        model.addAttribute("name", principal.getAttribute("name"));
        response.sendRedirect("/whoami");
        return "home";
    }

    @GetMapping("/whoami")
    public String whoami(OAuth2AuthenticationToken auth, HttpServletResponse response) throws IOException {
        if (auth != null) {
            return auth.getPrincipal().getAttributes().toString();
        } else {
            response.sendRedirect("/home");
            return null;
        }
    }
}
