package com.ayur.admin.config;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class TwoFactorAuthConfig {

    @Bean
    public GoogleAuthenticator googleAuthenticator() {
        GoogleAuthenticatorConfigBuilder configBuilder =
            new GoogleAuthenticatorConfigBuilder()
                .setTimeStepSizeInMillis(TimeUnit.SECONDS.toMillis(30))
                .setWindowSize(5)
                .setCodeDigits(6);

        return new GoogleAuthenticator(configBuilder.build());
    }
}
