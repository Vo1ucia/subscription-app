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
        
        // Autoriser l'origine de votre application Angular (en développement)
        config.addAllowedOrigin("http://localhost:4200"); // Port standard Angular
        
        // Si vous prévoyez de déployer avec Docker, vous pourriez avoir besoin d'ajouter:
        // config.addAllowedOrigin("http://localhost:80"); // ou un autre port selon votre config Docker
        
        // Vous pouvez aussi autoriser toutes les origines (moins sécurisé mais pratique pour le dev)
        // config.addAllowedOrigin("*");
        
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true); // Important si vous utilisez des cookies/sessions
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}