package com.lucky.main.controller;

import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.dto.PageResponse;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/api/contact")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminContactMessageController {
    private final ContactMessageService contactMessageService;

    @GetMapping
    public ResponseEntity<PageResponse<ContactMessageResponse>> getAllContactMessage(@PageableDefault(size = 10, sort = "id") Pageable pageable) {

        return ResponseEntity.ok(contactMessageService.getAllContactMessages(pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ContactMessageResponse> updateContactMessageStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus ticketStatus
    ) {

        ContactMessageResponse updatedMessage =
                contactMessageService.updateContactMessage(id, ticketStatus);

        return ResponseEntity.ok(updatedMessage);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<ContactMessageResponse>> getSearchedContactMessages(
            @RequestParam(required = false, value = "keyword") String keyword,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(contactMessageService.getfilteredContactMessages(keyword, pageable));

    }

    @GetMapping("/count")
    public ResponseEntity<Long> getContactMessageCount() {
        return ResponseEntity.ok(contactMessageService.getTotalContactMessageCount());
    }

    @GetMapping("/pending-queries/count")
    public ResponseEntity<Long> getPendingQueriesCount() {
        return ResponseEntity.ok(contactMessageService.getPendingQueriesCount());
    }
}
