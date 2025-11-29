package tastebase.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import tastebase.Config;
import tastebase.api.security.jwt.JwtAuthenticationFilter;
import tastebase.api.security.jwt.JwtLogoutHandler;
import tastebase.api.security.jwt.JwtUtil;
import tastebase.api.security.jwt.OAuth2JwtSuccessHandler;
import tastebase.api.service.OIDCUserService;
import tastebase.api.service.OAuthUserService;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            OAuthUserService oAuthUserService,
            OIDCUserService oidcUserService,
            OAuth2JwtSuccessHandler oAuth2JwtSuccessHandler,
            JwtUtil jWTUtil,
            JwtLogoutHandler jwtLogoutHandler) throws Exception {

        http
                .cors().and()
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .antMatchers("/api/user/*/avatar").permitAll()
                                .antMatchers("/home", "/whoami").authenticated()
                                .antMatchers("/logout").authenticated()
                                .antMatchers("/api/user/**").authenticated()
                                .antMatchers("/api/pantry/**").authenticated()
                                .anyRequest().permitAll()
                )
                .csrf().disable()
                .oauth2Login(oauth -> {
                    oauth.userInfoEndpoint(userInfo -> {
                        userInfo
                                .userService(oAuthUserService)
                                .oidcUserService(oidcUserService);
                    })
                    .successHandler(oAuth2JwtSuccessHandler);
                })
                .addFilterBefore(new JwtAuthenticationFilter(jWTUtil), UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .addLogoutHandler(jwtLogoutHandler)
                        .logoutSuccessHandler((request, response, authentication) -> {})
                );
        return http.build();
    }

    @Bean
    public HttpFirewall looseFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowUrlEncodedDoubleSlash(true);
        firewall.setAllowBackSlash(true);
        return firewall;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(HttpFirewall firewall) {
        return (web) -> web.httpFirewall(firewall);
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(this.googleClientRegistration());
    }

    private ClientRegistration googleClientRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId(Config.get("spring.security.oauth2.client.registration.google.client-id"))
                .clientSecret(Config.get("spring.security.oauth2.client.registration.google.client-secret"))
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .clientName("Google")
                .build();
    }
}
