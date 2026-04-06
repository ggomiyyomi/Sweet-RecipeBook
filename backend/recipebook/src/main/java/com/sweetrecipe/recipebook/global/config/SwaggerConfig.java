package com.sweetrecipe.recipebook.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("재현하다 RecipeBook API")
                        .description("재현하다 RecipeBook 백엔드 API 문서")
                        .version("v1.0.0"));
    }
}
