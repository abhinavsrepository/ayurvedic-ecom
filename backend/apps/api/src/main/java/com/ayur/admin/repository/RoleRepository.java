package com.ayur.admin.repository;

import com.ayur.admin.domain.Role;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

  Optional<Role> findByName(Role.RoleName name);

  boolean existsByName(Role.RoleName name);
}
