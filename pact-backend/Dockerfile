# 1. Aşama: Maven ile Derleme (Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Bağımlılıkları kopyala ve indir
COPY pom.xml .
RUN mvn dependency:go-offline

# Kaynak kodları kopyala ve derle
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma (Java 21 JRE - Stabil Sürüm)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]