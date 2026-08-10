package com.lucky.main.repository;

import com.lucky.main.dto.RecentUserDTO;
import com.lucky.main.entity.Role;
import com.lucky.main.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("""
                SELECT u
                FROM User u
                WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<User> searchUsers(@Param("keyword") String keyword);

    @Query("""
            SELECT COUNT(DISTINCT u)
            FROM User u
            JOIN u.roles r
            WHERE r = :role
            """)
    Long countUsersByRole(@Param("role") Role role);

    @Query("""
            SELECT new com.lucky.main.dto.RecentUserDTO(
                u.id,
                CONCAT(u.firstName,' ',u.lastName),
                u.email,
                u.createdAt
            )
            FROM User u
            ORDER BY u.createdAt DESC
            """)
    List<RecentUserDTO> findRecentUsers(Pageable pageable);
}
