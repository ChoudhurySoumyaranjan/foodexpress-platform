package com.lucky.main.repository;

import com.lucky.main.dto.RecentQueryDTO;
import com.lucky.main.entity.ContactMessage;
import com.lucky.main.enums.TicketStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    @Query("""
                SELECT c
                FROM ContactMessage c
                WHERE
                    LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR c.phoneNumber LIKE CONCAT('%', :keyword, '%')
                    OR LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%'))
                ORDER BY c.createdAt DESC
            """)
    List<ContactMessage> searchMessages(@Param("keyword") String keyword);

    long countByStatusIn(Collection<TicketStatus> statuses);

    @Query("""
            SELECT new com.lucky.main.dto.RecentQueryDTO(
                c.id,
                c.fullName,
                c.status,
                c.subject,
                c.createdAt
            )
            FROM ContactMessage c
            ORDER BY c.createdAt DESC
            """)
    List<RecentQueryDTO> findRecentQueries(Pageable pageable);
}

