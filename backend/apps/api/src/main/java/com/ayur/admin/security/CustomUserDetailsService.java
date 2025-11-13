package com.ayur.admin.security;

import com.ayur.admin.domain.User;
import com.ayur.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameWithRoles(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (!user.getEnabled()) {
            throw new UsernameNotFoundException("User account is disabled");
        }

        if (Boolean.TRUE.equals(user.getAccountLocked())) {
            throw new UsernameNotFoundException("User account is locked");
        }

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities(user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().name()))
                .collect(Collectors.toList()))
            .accountExpired(false)
            .accountLocked(Boolean.TRUE.equals(user.getAccountLocked()))
            .credentialsExpired(false)
            .disabled(!user.getEnabled())
            .build();
    }
}
