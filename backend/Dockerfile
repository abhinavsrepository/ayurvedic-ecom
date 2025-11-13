# Build stage
FROM gradle:8.5-jdk21-alpine AS builder

WORKDIR /app

# Copy gradle files
COPY settings.gradle.kts build.gradle.kts gradle.properties ./
COPY gradle ./gradle

# Copy source code
COPY apps ./apps
COPY libs ./libs

# Build application
RUN gradle :apps:api:bootJar --no-daemon --parallel

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 spring && \
    adduser -D -u 1001 -G spring spring

# Copy jar from builder
COPY --from=builder /app/apps/api/build/libs/ayurveda-admin-api.jar app.jar

# Change ownership
RUN chown -R spring:spring /app

USER spring

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]
