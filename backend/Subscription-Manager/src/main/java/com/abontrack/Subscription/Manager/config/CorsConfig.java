package com.abontrack.Subscription.Manager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        

        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("https://subscription-app-ten-ivory.vercel.app/"); 
        
        
        
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true); // Important si vous utilisez des cookies/sessions
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}