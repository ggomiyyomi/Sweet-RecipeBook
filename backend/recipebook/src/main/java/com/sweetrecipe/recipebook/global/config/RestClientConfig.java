package com.sweetrecipe.recipebook.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@RequiredArgsConstructor
public class RestClientConfig {

    private final SweetBookProperties properties;

    @Bean
    public RestClient sweetBookRestClient() {
        String baseUrl = properties.getBaseUrl();
        if (!baseUrl.endsWith("/")) baseUrl += "/";

        return RestClient.builder()
                .baseUrl(baseUrl + "v1")
                .requestInterceptor((request, body, execution) -> {
                    request.getHeaders().set("Authorization", "Bearer " + properties.getApiKey());
                    return execution.execute(request, body);
                })
                .build();
    }
}
