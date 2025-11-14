plugins {
    java
    id("org.springframework.boot") version "3.2.5" apply false
    id("io.spring.dependency-management") version "1.1.5" apply false
    id("com.diffplug.spotless") version "6.25.0"
    id("com.github.spotbugs") version "6.0.7" apply false
    id("org.owasp.dependencycheck") version "9.0.9"
    id("jacoco")
}

allprojects {
    group = "com.ayur.admin"
    version = "1.0.0-SNAPSHOT"

    repositories {
        mavenCentral()
        maven { url = uri("https://repo.spring.io/milestone") }
    }

}

subprojects {
    apply(plugin = "java")
    apply(plugin = "jacoco")

    java {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    tasks.withType<JavaCompile> {
        options.encoding = "UTF-8"
        options.compilerArgs.addAll(listOf("-parameters", "-Xlint:unchecked", "-Xlint:deprecation"))
    }

    tasks.test {
        useJUnitPlatform()
        finalizedBy(tasks.jacocoTestReport)
    }

    tasks.jacocoTestReport {
        dependsOn(tasks.test)
        reports {
            xml.required.set(true)
            html.required.set(true)
        }
    }

    tasks.jacocoTestCoverageVerification {
        violationRules {
            rule {
                limit {
                    minimum = "0.80".toBigDecimal()
                }
            }
        }
    }
}

// Spotless configuration
spotless {
    java {
        target("**/*.java")
        googleJavaFormat("1.19.1")
        removeUnusedImports()
        trimTrailingWhitespace()
        endWithNewline()
    }
}

// OWASP Dependency Check
dependencyCheck {
    formats = listOf("HTML", "JSON")
    failBuildOnCVSS = 7.0f
    suppressionFile = "owasp-suppressions.xml"
}

tasks.register("checkCodeQuality") {
    dependsOn("spotlessCheck", "dependencyCheckAggregate")
    group = "verification"
    description = "Run all code quality checks"
}
