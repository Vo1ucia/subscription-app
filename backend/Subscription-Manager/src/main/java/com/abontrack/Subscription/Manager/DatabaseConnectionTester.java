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
            System.out.println("=== TEST DE LA CONNEXION À LA BASE DE DONNÉES ===");
            
            // Exécution d'une requête simple
            String result = jdbcTemplate.queryForObject("SELECT 'Connexion à PostgreSQL réussie!'", String.class);
            System.out.println(result);
            
            // Vérifier la version de PostgreSQL
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            System.out.println("Version de la base de données: " + version);
            
            // Compter les tables
            Integer tableCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'", Integer.class);
            System.out.println("Nombre de tables: " + tableCount);
            
            // Vérifier que les tables principales existent
            System.out.println("Vérification des tables principales:");
            String[] tables = {"users", "categories", "payment_frequencies", "subscriptions"};
            for (String table : tables) {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ?", 
                    Integer.class, table);
                System.out.println("- Table '" + table + "': " + (count > 0 ? "OK" : "MANQUANTE"));
            }
            
            System.out.println("=== TEST DE CONNEXION TERMINÉ AVEC SUCCÈS ===");
        } catch (Exception e) {
            System.err.println("=== ERREUR DE CONNEXION À LA BASE DE DONNÉES ===");
            System.err.println("Message d'erreur: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=============================================");
        }
    }
}