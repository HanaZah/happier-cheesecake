# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
# Copy Gradle wrapper and configuration files first to cache dependencies
COPY gradle/ gradle/
COPY gradlew build.gradle.kts settings.gradle.kts ./
# Copy source code and build the executable jar (skipping tests for deployment speed)
COPY src/ src/
RUN ./gradlew bootJar -x test

# Stage 2: Minimal runtime environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Extract the compiled jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]