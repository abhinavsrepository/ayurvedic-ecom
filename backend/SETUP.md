# 🚀 Backend Setup Instructions

## Prerequisites

1. **Java 21** - Download from [Adoptium](https://adoptium.net/)
2. **Docker Desktop** - For PostgreSQL and Redis
3. **Gradle 8.5+** (optional, can use wrapper)

## ⚡ Quick Setup

### Step 1: Install Gradle Wrapper (Windows)

Since the wrapper JAR is not included, run this command in the `backend` directory:

```cmd
gradle wrapper --gradle-version 8.5
```

This will download and configure the Gradle wrapper for you.

### Step 2: Verify Java Installation

```cmd
java -version
```

Should show Java 21.

### Step 3: Start Infrastructure Services

```cmd
docker-compose up -d postgres redis
```

Wait 10 seconds for services to start.

### Step 4: Build the Project

```cmd
gradlew.bat build -x test
```

### Step 5: Run the Application

```cmd
gradlew.bat :apps:api:bootRun
```

Or use the startup script:

```cmd
start-local.bat
```

## 🔍 Verify Installation

Once started, open:

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## 🐛 Common Errors & Solutions

### Error: ClassNotFoundException: GradleWrapperMain

**Solution**: Run `gradle wrapper --gradle-version 8.5` first

### Error: Cannot connect to PostgreSQL

**Solution**:
```cmd
docker-compose up -d postgres
docker ps  # Verify postgres is running
```

### Error: Port 8080 already in use

**Solution**: Change port in `application.yml`:
```yaml
server:
  port: 8081
```

### Error: JWT_SECRET not found

**Solution**: The default secret in `application.yml` works for local dev

## 📦 Project Structure

```
backend/
├── apps/
│   └── api/                           # Main Spring Boot app
│       ├── src/main/java/
│       │   └── com/ayur/admin/
│       │       ├── config/            # Configuration
│       │       ├── security/          # JWT & Security
│       │       ├── domain/            # JPA Entities
│       │       ├── repository/        # Data Access
│       │       ├── service/           # Business Logic
│       │       └── web/rest/          # REST Controllers
│       ├── src/main/resources/
│       │   ├── application.yml        # Main config
│       │   └── db/migration/          # Flyway SQL
│       └── build.gradle.kts
├── libs/                              # Reusable libraries
├── docker-compose.yml                 # Local infrastructure
└── build.gradle.kts                   # Root build config
```

## 🧪 Testing

```cmd
# Run tests
gradlew.bat test

# Run with coverage
gradlew.bat test jacocoTestReport
```

## 📝 Database Access

Connect to local PostgreSQL:

- **Host**: localhost
- **Port**: 5432
- **Database**: ayurveda_admin
- **Username**: postgres
- **Password**: postgres

## 🔐 Default Test Users

After enabling mock data (`MOCK_DATA_ENABLED=true`), these users will be created:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| ops | ops123 | OPS |
| finance | finance123 | FINANCE |
| marketing | marketing123 | MARKETING |

## 🛠️ Development Tips

### Hot Reload with DevTools

Add to `build.gradle.kts`:
```kotlin
developmentOnly("org.springframework.boot:spring-boot-devtools")
```

### View Logs

```cmd
# In docker-compose directory
docker-compose logs -f api
```

### Reset Database

```cmd
docker-compose down -v
docker-compose up -d postgres
```

### IDE Setup (IntelliJ IDEA)

1. Open `backend` folder as project
2. IDEA will auto-detect Gradle
3. Enable annotation processing for Lombok
4. Set Java SDK to 21

### IDE Setup (VS Code)

Install extensions:
- Extension Pack for Java
- Spring Boot Extension Pack
- Lombok Annotations Support

## 📚 Next Steps

1. ✅ Backend is running
2. 📝 Test API with Swagger UI
3. 🔐 Try login with test users
4. 🧪 Run the test suite
5. 📊 Check Prometheus metrics at `/actuator/prometheus`

## 💡 Need Help?

Check these files:
- `README.md` - Overview
- `application.yml` - Configuration
- Build logs - Check console output

---

**Happy Coding! 🎉**
