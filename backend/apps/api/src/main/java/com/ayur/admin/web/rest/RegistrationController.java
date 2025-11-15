package com.ayur.admin.web.rest;

import com.ayur.admin.domain.Role;
import com.ayur.admin.domain.User;
import com.ayur.admin.repository.RoleRepository;
import com.ayur.admin.repository.UserRepository;
import com.ayur.admin.security.JwtUtil;
import com.ayur.admin.service.dto.LoginResponse;
import com.ayur.admin.service.dto.RegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Registration", description = "User registration endpoint")
@RequiredArgsConstructor
@Slf4j
public class RegistrationController {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @PostMapping("/register")
  @Operation(summary = "Register new user", description = "Create a new user account")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    try {
      // Check if username already exists
      if (userRepository.findByUsername(request.getUsername()).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("Username already exists"));
      }

      // Check if email already exists
      if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("Email already exists"));
      }

      // Create new user
      User user = new User();
      user.setUsername(request.getUsername());
      user.setEmail(request.getEmail());
      user.setPassword(passwordEncoder.encode(request.getPassword()));
      user.setFullName(request.getFullName());
      user.setEnabled(true);
      user.setTwoFaEnabled(false);
      user.setFailedLoginAttempts(0);

      // Assign default role (first user gets ADMIN, others get OPS)
      Set<Role> roles = new HashSet<>();
      long userCount = userRepository.count();

      if (userCount == 0) {
        // First user gets ADMIN role
        Role adminRole =
            roleRepository
                .findByName(Role.RoleName.ADMIN)
                .orElseThrow(() -> new IllegalStateException("ADMIN role not found in database"));
        roles.add(adminRole);
        log.info("First user registration - assigning ADMIN role");
      } else {
        // Subsequent users get OPS role by default
        Role userRole =
            roleRepository
                .findByName(Role.RoleName.OPS)
                .orElseGet(
                    () -> {
                      // Create OPS role if it doesn't exist
                      Role newRole = new Role();
                      newRole.setName(Role.RoleName.OPS);
                      newRole.setDescription("Operations staff with limited access");
                      return roleRepository.save(newRole);
                    });
        roles.add(userRole);
      }

      user.setRoles(roles);

      // Save user
      user = userRepository.save(user);

      log.info("New user registered: {}", user.getUsername());

      // Generate tokens and return login response
      UserDetails userDetails =
          org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
              .password(user.getPassword())
              .authorities(
                  user.getRoles().stream()
                      .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                      .collect(Collectors.toList()))
              .build();

      String accessToken = jwtUtil.generateAccessToken(userDetails);
      String refreshToken = jwtUtil.generateRefreshToken(userDetails);

      LoginResponse response =
          LoginResponse.builder()
              .accessToken(accessToken)
              .refreshToken(refreshToken)
              .tokenType("Bearer")
              .expiresIn(900L)
              .user(
                  LoginResponse.UserInfo.builder()
                      .username(user.getUsername())
                      .email(user.getEmail())
                      .fullName(user.getFullName())
                      .roles(
                          user.getRoles().stream()
                              .map(role -> role.getName().name())
                              .collect(Collectors.toSet()))
                      .twoFaEnabled(user.getTwoFaEnabled())
                      .build())
              .build();

      return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (Exception e) {
      log.error("Registration failed", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new ErrorResponse("Registration failed: " + e.getMessage()));
    }
  }

  // Simple error response class
  private record ErrorResponse(String message) {}
}
