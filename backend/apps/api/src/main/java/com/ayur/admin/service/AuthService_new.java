package com.ayur.admin.service;

import com.ayur.admin.domain.Role;
import com.ayur.admin.domain.User;
import com.ayur.admin.repository.RoleRepository;
import com.ayur.admin.repository.UserRepository;
import com.ayur.admin.security.JwtUtil;
import com.ayur.admin.service.dto.*;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;
  private final GoogleAuthenticator googleAuthenticator;

  @Transactional
  public LoginResponse register(RegisterRequest request) {
    // Check if username already exists
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      throw new IllegalStateException("Username already exists");
    }

    // Check if email already exists
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new IllegalStateException("Email already exists");
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
      Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
          .orElseThrow(() -> new IllegalStateException("ADMIN role not found in database"));
      roles.add(adminRole);
      log.info("First user registration - assigning ADMIN role");
    } else {
      // Subsequent users get OPS role by default
      Role userRole = roleRepository.findByName(Role.RoleName.OPS)
          .orElseGet(() -> {
            // Create OPS role if it doesn't exist
            Role newRole = new User();
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

    return LoginResponse.builder()
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
  }

  @Transactional
  public LoginResponse login(LoginRequest request) {
    // Authenticate user
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

    User user =
        userRepository
            .findByUsername(request.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // Check 2FA if enabled
    if (Boolean.TRUE.equals(user.getTwoFaEnabled())) {
      if (request.getTwoFaCode() == null || request.getTwoFaCode().isBlank()) {
        throw new IllegalStateException("2FA code required");
      }
      if (!googleAuthenticator.authorize(
          user.getTwoFaSecret(), Integer.parseInt(request.getTwoFaCode()))) {
        throw new IllegalStateException("Invalid 2FA code");
      }
    }

    // Update last login
    user.setLastLoginAt(Instant.now());
    user.setFailedLoginAttempts(0);
    userRepository.save(user);

    // Generate tokens
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

    log.info("User {} logged in successfully", user.getUsername());

    return LoginResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .tokenType("Bearer")
        .expiresIn(900L) // 15 minutes
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
  }

  @Transactional
  public LoginResponse refreshToken(String refreshToken) {
    String username = jwtUtil.extractUsername(refreshToken);
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    UserDetails userDetails =
        org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities(
                user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                    .collect(Collectors.toList()))
            .build();

    String newAccessToken = jwtUtil.generateAccessToken(userDetails);
    String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

    return LoginResponse.builder()
        .accessToken(newAccessToken)
        .refreshToken(newRefreshToken)
        .tokenType("Bearer")
        .expiresIn(900L)
        .build();
  }

  @Transactional
  public void logout(String username) {
    log.info("User {} logged out", username);
    // In a real implementation, you would invalidate the JWT tokens
    // by storing them in Redis with expiration
  }

  @Transactional(readOnly = true)
  public UserProfileResponse getCurrentUserProfile(String username) {
    User user =
        userRepository
            .findByUsernameWithRoles(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return UserProfileResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phoneNumber(user.getPhoneNumber())
        .roles(
            user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet()))
        .twoFaEnabled(user.getTwoFaEnabled())
        .lastLoginAt(user.getLastLoginAt())
        .createdAt(user.getCreatedAt())
        .build();
  }

  @Transactional
  public TwoFaEnableResponse enableTwoFa(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (Boolean.TRUE.equals(user.getTwoFaEnabled())) {
      throw new IllegalStateException("2FA is already enabled");
    }

    GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
    user.setTwoFaSecret(key.getKey());
    userRepository.save(user);

    String qrCodeUrl =
        GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL("Ayurveda Admin", user.getEmail(), key);

    log.info("2FA setup initiated for user {}", username);

    return TwoFaEnableResponse.builder().secret(key.getKey()).qrCodeUrl(qrCodeUrl).build();
  }

  @Transactional
  public void verifyTwoFa(String username, String code) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (user.getTwoFaSecret() == null) {
      throw new IllegalStateException("2FA is not set up");
    }

    boolean isValid = googleAuthenticator.authorize(user.getTwoFaSecret(), Integer.parseInt(code));
    if (!isValid) {
      throw new IllegalStateException("Invalid 2FA code");
    }

    user.setTwoFaEnabled(true);
    userRepository.save(user);

    log.info("2FA enabled successfully for user {}", username);
  }

  @Transactional
  public void disableTwoFa(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    user.setTwoFaEnabled(false);
    user.setTwoFaSecret(null);
    userRepository.save(user);

    log.info("2FA disabled for user {}", username);
  }
}
