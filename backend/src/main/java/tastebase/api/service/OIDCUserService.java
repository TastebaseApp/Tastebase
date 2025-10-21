package tastebase.api.service;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tastebase.database.UserDAO;
import tastebase.obj.User;
import tastebase.obj.UserPrincipal;

import java.util.Map;

@Service
public class OIDCUserService extends OidcUserService {

    @Override
    public OidcUser loadUser(OidcUserRequest request) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(request);
        Map<String,Object> attributes = oidcUser.getAttributes();

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
            UserDAO.upsert(user);
        }

        return new UserPrincipal(user, attributes, request.getIdToken(), oidcUser.getUserInfo());
    }
}
