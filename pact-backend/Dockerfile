# 1. Aşama: Maven ile Derleme (Java 21 kullanıyoruz)
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Bağımlılıkları önbelleğe alalım
COPY pom.xml .
RUN mvn dependency:go-offline

# Kaynak kodları kopyalayıp derleyelim
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma (Java 21 Hafif İmaj)
FROM eclipse-temurin:21-jr-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]