# Stage 1: Build Spring Boot app

FROM maven:3-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom first for better Docker layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Stage 2: Run Spring Boot app

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated jar
COPY --from=build /app/target/backend-spring.jar app.jar

EXPOSE 5001

ENTRYPOINT ["java", "-jar", "app.jar"]