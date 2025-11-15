package com.ayur.admin.web.rest;

import com.ayur.admin.service.AuthService;
import com.ayur.admin.service.dto.LoginRequest;
import com.ayur.admin.service.dto.LoginResponse;
import com.ayur.admin.service.dto.TwoFaEnableResponse;
import com.ayur.admin.service.dto.TwoFaVerifyRequest;
import com.ayur.admin.service.dto.UserProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and user management endpoints")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  @Operation(summary = "User login", description = "Authenticate user with username and password")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/refresh")
  @Operation(
      summary = "Refresh access token",
      description = "Get new access token using refresh token")
  public ResponseEntity<LoginResponse> refresh(
      @RequestHeader("X-Refresh-Token") String refreshToken) {
    LoginResponse response = authService.refreshToken(refreshToken);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/logout")
  @Operation(summary = "User logout", description = "Invalidate current user session")
  public ResponseEntity<Void> logout(Authentication authentication) {
    authService.logout(authentication.getName());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me")
  @Operation(
      summary = "Get current user",
      description = "Retrieve current authenticated user profile")
  public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
    UserProfileResponse response = authService.getCurrentUserProfile(authentication.getName());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/2fa/enable")
  @PreAuthorize("isAuthenticated()")
  @Operation(
      summary = "Enable 2FA",
      description = "Enable two-factor authentication for current user")
  public ResponseEntity<TwoFaEnableResponse> enableTwoFa(Authentication authentication) {
    TwoFaEnableResponse response = authService.enableTwoFa(authentication.getName());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/2fa/verify")
  @PreAuthorize("isAuthenticated()")
  @Operation(
      summary = "Verify 2FA code",
      description = "Verify TOTP code to complete 2FA setup or login")
  public ResponseEntity<Void> verifyTwoFa(
      @Valid @RequestBody TwoFaVerifyRequest request, Authentication authentication) {
    authService.verifyTwoFa(authentication.getName(), request.getCode());
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/2fa/disable")
  @PreAuthorize("isAuthenticated()")
  @Operation(
      summary = "Disable 2FA",
      description = "Disable two-factor authentication for current user")
  public ResponseEntity<Void> disableTwoFa(Authentication authentication) {
    authService.disableTwoFa(authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
