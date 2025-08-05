# Étape 1 : Image Java officielle
FROM eclipse-temurin:19-jdk-alpine

# Création d’un dossier pour l’app
WORKDIR /app

# Copie du .jar
COPY target/Subscription-Manager-0.0.1-SNAPSHOT.jar app.jar


# Port exposé (par défaut dans Spring Boot)
EXPOSE 8080

# Commande de lancement
ENTRYPOINT ["java", "-Dspring.h2.console.settings.web-allow-others=true", "-jar", "app.jar"]

