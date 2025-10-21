package tastebase.api.service;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import tastebase.database.UserDAO;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import java.util.Map;

public class OIDCUserService extends OidcUserService {

    @Override
    public OIDCUserService loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);

        return buildUserPrincipal(request, oAuth2User.getAttributes());
    }

    private UserPrincipal buildUserPrincipal(OAuth2UserRequest request, Map<String, Object> attributes) {
        String provider = request.getClientRegistration().getRegistrationId();
        String providerID = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        User user = UserDAO.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setProviderID(providerID);
            user.setName(name);
            user.setProvider(provider);
            UserDAO.create(user);
        }

        return new UserPrincipal(user, attributes);


    }
