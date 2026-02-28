# 1. Aşama: Maven ile Derleme
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
# Önce sadece pom.xml'i kopyalayıp bağımlılıkları indirelim (Hız kazandırır)
COPY pom.xml .
RUN mvn dependency:go-offline

# Şimdi tüm kaynak kodları kopyalayalım
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Çalıştırma (Hafif İmaj)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]