
# Étape de build
FROM maven:3.9.6-eclipse-temurin-19 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape finale
FROM eclipse-temurin:19-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java","-Dspring.h2.console.settings.web-allow-others=true", "-jar", "/app/app.jar"]