package com.abontrack.Subscription.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConnectionTester implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            String version = jdbcTemplate.queryForObject("SELECT CURRENT_TIMESTAMP", String.class);
            System.out.println("H2 version: " + version);
        } catch (Exception e) {
            System.out.println("Erreur pendant le test BDD : " + e.getMessage());
        }
    }
}