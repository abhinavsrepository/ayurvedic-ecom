package com.ayur.admin.web.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Test controller to help debug authentication issues
 * DELETE THIS FILE IN PRODUCTION!
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final PasswordEncoder passwordEncoder;

    /**
     * Generate a BCrypt hash for a given password
     * Use this to verify password hashing
     */
    @GetMapping("/hash/{password}")
    public String generateHash(@PathVariable String password) {
        String hash = passwordEncoder.encode(password);
        return "{\n" +
               "  \"plainPassword\": \"" + password + "\",\n" +
               "  \"bcryptHash\": \"" + hash + "\",\n" +
               "  \"strength\": \"12\"\n" +
               "}";
    }

    /**
     * Test if a password matches a hash
     */
    @PostMapping("/verify")
    public String verifyPassword(@RequestBody PasswordVerifyRequest request) {
        boolean matches = passwordEncoder.matches(request.getPassword(), request.getHash());
        return "{\n" +
               "  \"password\": \"" + request.getPassword() + "\",\n" +
               "  \"hash\": \"" + request.getHash().substring(0, 20) + "...\",\n" +
               "  \"matches\": " + matches + "\n" +
               "}";
    }

    public static class PasswordVerifyRequest {
        public String password;
        public String hash;
    }
}
