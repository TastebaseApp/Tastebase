package tastebase.api.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tastebase.obj.User;

import java.util.UUID;

@Service
public class UserService {

    public User createUser(OAuth2User oauth2user) {
        User user = new User(UUID.randomUUID(), oauth2user.getAttribute("name"), oauth2user.getAttribute("email"));
        System.out.println("New user created: " + user);
        return user;
    }

}
