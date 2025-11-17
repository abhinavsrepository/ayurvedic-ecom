// Quick Java snippet to generate the correct BCrypt hash
// Compile and run: java generate_correct_hash.java

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class generate_correct_hash {
    public static void main(String[] args) {
        // Using strength 12 to match SecurityConfig.java
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "admin123";
        String hash = encoder.encode(password);

        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash (strength 12): " + hash);
        System.out.println("\nSQL:");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
    }
}
