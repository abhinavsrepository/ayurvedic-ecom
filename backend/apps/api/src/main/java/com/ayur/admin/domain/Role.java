package com.ayur.admin.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "roles")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, unique = true, length = 50)
  private RoleName name;

  @Column(length = 500)
  private String description;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  public enum RoleName {
    ADMIN,
    OPS,
    FINANCE,
    MARKETING
  }
}
