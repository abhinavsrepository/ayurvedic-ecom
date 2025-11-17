package com.ayur.admin.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** Utility to generate BCrypt password hash. Run this class to generate a hash for "admin123" */
public class PasswordHashGenerator {
  public static void main(String[] args) {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String password = "admin123";
    String hash = encoder.encode(password);

    System.out.println("=".repeat(80));
    System.out.println("BCrypt Hash Generator");
    System.out.println("=".repeat(80));
    System.out.println("Plain Password: " + password);
    System.out.println("BCrypt Hash:    " + hash);
    System.out.println("=".repeat(80));
    System.out.println("\nUse this hash in your database migration:");
    System.out.println(
        "INSERT INTO users (username, email, password, full_name, enabled, two_fa_enabled)");
    System.out.println(
        "VALUES ('admin', 'admin@ayurveda.com', '" + hash + "', 'Admin User', true, false);");
    System.out.println("=".repeat(80));
  }
}
