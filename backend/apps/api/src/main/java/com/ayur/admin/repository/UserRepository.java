package com.ayur.admin.repository;

import com.ayur.admin.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
  Optional<User> findByUsernameWithRoles(String username);

  @Query("SELECT u FROM User u WHERE u.email = :email AND u.enabled = true")
  Optional<User> findActiveByEmail(String email);
}
