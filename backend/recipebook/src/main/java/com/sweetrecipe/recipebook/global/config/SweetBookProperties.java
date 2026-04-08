package com.sweetrecipe.recipebook.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "sweetbook")
public class SweetBookProperties {
    private String apiKey;
    private String baseUrl;
    private String webhookSecret;
}
