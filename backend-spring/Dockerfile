FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/fullstack-web.jar app.jar

EXPOSE 5001

ENTRYPOINT ["java","-jar","app.jar"]
