plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    java
}

ext["snakeyaml.version"] = "1.33"

dependencies {
    // Fix snakeyaml android variant issue
    implementation("org.yaml:snakeyaml:1.33")

    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-cache")

    // Database
    runtimeOnly("org.postgresql:postgresql:42.7.3")
    implementation("org.flywaydb:flyway-core:10.10.0")
    implementation("org.flywaydb:flyway-database-postgresql:10.10.0")
    implementation("org.hibernate.orm:hibernate-envers:6.4.4.Final")

    // Redis
    implementation("io.lettuce:lettuce-core")

    // Security & JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
    implementation("com.warrenstrange:googleauth:1.5.0")

    // Rate Limiting
    implementation("com.bucket4j:bucket4j-core:8.10.1")

    // OpenAPI/Swagger
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")

    // ML Libraries (lightweight)
    implementation("org.apache.commons:commons-math3:3.6.1")

    // Utilities
    implementation("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    implementation("com.github.javafaker:javafaker:1.0.2")
    implementation("org.apache.commons:commons-csv:1.10.0")

    // Monitoring
    implementation("io.sentry:sentry-spring-boot-starter-jakarta:7.6.0")
    implementation("io.micrometer:micrometer-registry-prometheus")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("com.h2database:h2")
}

tasks.bootJar {
    archiveFileName.set("ayurveda-admin-api.jar")
}

tasks.test {
    useJUnitPlatform()
}
