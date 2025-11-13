package com.ayur.admin.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Set<String> roles;
    private Boolean twoFaEnabled;
    private Instant lastLoginAt;
    private Instant createdAt;
}
