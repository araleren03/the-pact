# 1. Aşama: Derleme (Build)
FROM maven:3.8.4-openjdk-17-slim AS build
COPY . .
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma (Run)
FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]