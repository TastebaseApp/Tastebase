package tastebase.api.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tastebase.database.UserDAO;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import javax.annotation.PostConstruct;

@Service
public class UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();

        OAuth2User oAuth2User = delegate.loadUser(request);
        String provider = request.getClientRegistration().getRegistrationId();
        String providerID = oAuth2User.getAttributes().get("sub").toString();
        String email =  oAuth2User.getAttributes().get("email").toString();
        String name = oAuth2User.getAttributes().get("name").toString();

        System.out.println("Loading user: " + name);

        User user = UserDAO.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setProviderID(providerID);
            user.setName(name);
            user.setProvider(provider);

            UserDAO.create(user);
        }

        return new UserPrincipal(user, oAuth2User.getAttributes());
    }

    @PostConstruct
    public void init() {
        System.out.println("UserService bean initialized");
    }
}
