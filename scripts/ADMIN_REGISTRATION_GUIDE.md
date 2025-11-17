# Admin Registration Feature - Complete Guide

## Overview

I've added a complete user registration system to your Ayurveda Shop admin panel. Users can now create their own accounts with a secure signup form!

## ✨ Features Added

### 1. **Backend Registration API** ✅
- **Endpoint**: `POST /api/auth/register`
- **Location**: [RegistrationController.java](backend/apps/api/src/main/java/com/ayur/admin/web/rest/RegistrationController.java)
- **Security**: BCrypt password hashing (strength 12)
- **Validation**: Username, email, password strength checks
- **Auto-role assignment**:
  - First user gets `ADMIN` role
  - Subsequent users get `OPS` role

### 2. **Frontend Registration Page** ✅
- **URL**: `http://localhost:3000/admin/register`
- **Location**: [app/admin/register/page.tsx](ayurveda-shop/app/admin/register/page.tsx)
- **Features**:
  - Real-time form validation
  - Password strength indicator
  - Show/hide password toggle
  - Error messages for each field
  - Auto-login after registration

### 3. **Updated Login Page** ✅
- Added "Create one here" link to registration page
- **Location**: [app/admin/login/page.tsx](ayurveda-shop/app/admin/login/page.tsx)

## 🚀 How to Use

### Step 1: Start the Backend

```cmd
cd backend
gradlew.bat bootRun
```

Wait for the message: `Tomcat started on port(s): 8080`

### Step 2: Start the Frontend

```cmd
cd ayurveda-shop
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 3: Register a New User

1. **Go to the registration page**:
   ```
   http://localhost:3000/admin/register
   ```

   OR click "Create one here" link on the login page

2. **Fill in the registration form**:
   - **Full Name**: Your full name (min 2 characters)
   - **Username**: 3+ characters, letters, numbers, underscores, hyphens only
   - **Email**: Valid email address
   - **Password**: 8+ characters with:
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number
   - **Confirm Password**: Must match password

3. **Click "Create Account"**

4. **Success!** You'll be:
   - Automatically logged in
   - Redirected to the admin dashboard
   - Shown a welcome message

## 🔐 Security Features

### Password Requirements
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ BCrypt hashing with strength 12

### Username Requirements
- ✅ 3-50 characters
- ✅ Only letters, numbers, underscores, and hyphens
- ✅ Unique (checked against database)

### Email Requirements
- ✅ Valid email format
- ✅ Unique (checked against database)

### Backend Security
- ✅ Input validation with Jakarta Validation
- ✅ Duplicate username/email checks
- ✅ Secure password hashing
- ✅ CORS enabled for localhost:3000
- ✅ JWT token generation on successful registration

## 📋 Form Validation

The form validates in real-time:

| Field | Validation Rules | Error Messages |
|-------|------------------|----------------|
| Full Name | Required, 2+ chars | "Full name is required" / "Must be at least 2 characters" |
| Username | Required, 3+ chars, alphanumeric | "Username is required" / "Must be at least 3 characters" / "Can only contain letters, numbers, underscores and hyphens" |
| Email | Required, valid format | "Email is required" / "Please enter a valid email address" |
| Password | Required, 8+ chars, complexity | "Password is required" / "Must be at least 8 characters" / "Must contain uppercase, lowercase, and number" |
| Confirm Password | Required, must match | "Please confirm your password" / "Passwords do not match" |

## 🎯 User Roles

### First User
- **Role**: ADMIN
- **Permissions**: Full access to all admin features

### Subsequent Users
- **Role**: OPS (Operations)
- **Permissions**: Limited access (can be configured)

**Note**: Admins can later change user roles through the user management interface.

## 🧪 Testing the Registration

### Test with Valid Data

```
Full Name: John Doe
Username: johndoe
Email: john@example.com
Password: SecurePass123
Confirm Password: SecurePass123
```

**Expected**: Account created, auto-login, redirect to dashboard

### Test with Invalid Data

#### Weak Password
```
Password: weak
```
**Expected**: Error - "Password must be at least 8 characters"

#### Password Mismatch
```
Password: SecurePass123
Confirm Password: DifferentPass123
```
**Expected**: Error - "Passwords do not match"

#### Duplicate Username
Register twice with same username.
**Expected**: Error - "Username already exists"

#### Invalid Email
```
Email: notanemail
```
**Expected**: Error - "Please enter a valid email address"

## 📁 File Structure

```
Backend:
├── RegistrationController.java       # Registration endpoint
├── RegisterRequest.java               # DTO for registration data
├── SecurityConfig.java                # Updated to allow /api/auth/register
└── AuthService.java                   # (Not modified, using controller)

Frontend:
├── app/admin/register/page.tsx       # Registration page
├── app/admin/login/page.tsx          # Updated with register link
└── lib/api/client.ts                 # API client (already exists)
```

## 🔧 API Details

### Registration Request

**Endpoint**: `POST http://localhost:8080/api/auth/register`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

### Success Response (201 Created)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "roles": ["ADMIN"],
    "twoFaEnabled": false
  }
}
```

### Error Responses

#### 409 Conflict (Username exists)
```json
{
  "message": "Username already exists"
}
```

#### 409 Conflict (Email exists)
```json
{
  "message": "Email already exists"
}
```

#### 400 Bad Request (Validation error)
```json
{
  "message": "Validation failed",
  "errors": [
    "Password must be at least 8 characters"
  ]
}
```

## 🧪 Testing with cURL

### Test Registration API

```cmd
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"fullName\":\"Test User\"}"
```

**Success**: Returns JSON with access token and user info

## 🎨 UI Features

### Registration Form
- ✅ Clean, modern design matching the login page
- ✅ Real-time validation feedback
- ✅ Password visibility toggle
- ✅ Loading state during submission
- ✅ Error highlighting on invalid fields
- ✅ Responsive design (mobile-friendly)
- ✅ Accessibility features (labels, ARIA attributes)

### User Experience
- ✅ Instant feedback on form errors
- ✅ Success toast notification
- ✅ Automatic redirect to dashboard
- ✅ Clear password requirements
- ✅ Link back to login page

## 🐛 Troubleshooting

### Issue: "ADMIN role not found in database"

**Solution**: Make sure the database has the ADMIN role. Run this SQL:

```sql
INSERT INTO roles (name, description, created_at)
VALUES ('ADMIN', 'System Administrator', NOW())
ON CONFLICT (name) DO NOTHING;
```

### Issue: "Registration failed" error

**Check**:
1. Backend is running on port 8080
2. Database is accessible
3. Check browser console for detailed error
4. Check backend logs for stack trace

### Issue: Form validation not working

**Check**:
1. All required fields are filled
2. Password meets complexity requirements
3. Passwords match
4. Email format is valid
5. Username has no spaces or special characters

### Issue: "Failed to fetch" error

**Solution**:
- Ensure backend is running
- Check CORS settings in `SecurityConfig.java`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` is set to `http://localhost:8080`

## 📊 Database Schema

After registration, the user is stored in:

**users table**:
```sql
SELECT
  username,
  email,
  full_name,
  enabled,
  two_fa_enabled,
  created_at
FROM users;
```

**user_roles table** (join):
```sql
SELECT
  u.username,
  r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id;
```

## 🎉 Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can access registration page at `/admin/register`
- [ ] Form validation works correctly
- [ ] Can create new account with valid data
- [ ] Auto-login works after registration
- [ ] Redirected to admin dashboard
- [ ] Can logout and login again with new credentials
- [ ] First user gets ADMIN role
- [ ] Subsequent users get OPS role

## 🔄 What Happens After Registration?

1. ✅ User fills out the form
2. ✅ Frontend validates all fields
3. ✅ POST request sent to `/api/auth/register`
4. ✅ Backend validates data (duplicate checks, password strength)
5. ✅ Password is hashed with BCrypt (strength 12)
6. ✅ User is saved to database
7. ✅ User-role relationship is created
8. ✅ JWT tokens are generated
9. ✅ Tokens are stored in localStorage
10. ✅ User is redirected to admin dashboard
11. ✅ Welcome toast notification appears

## 📝 Next Steps

You can now:
1. ✅ Create admin accounts without SQL scripts
2. ✅ Users can self-register
3. ✅ First user automatically becomes admin
4. ✅ Add more roles (FINANCE, MARKETING) later
5. ✅ Build user management UI to change roles
6. ✅ Add email verification (optional enhancement)
7. ✅ Add password reset functionality (optional enhancement)

---

**Need Help?**

- Check browser console for frontend errors
- Check backend logs for API errors
- Verify database connection
- Ensure all environment variables are set

**Ready to test!** Just start both servers and navigate to `http://localhost:3000/admin/register` 🚀
