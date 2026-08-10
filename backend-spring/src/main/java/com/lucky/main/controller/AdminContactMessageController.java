package com.lucky.main.controller;

import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/api/contact")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminContactMessageController {
    private final ContactMessageService contactMessageService;

    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> getAllContactMessage() {

        java.util.List<ContactMessageResponse> contactMessageResponses = contactMessageService.getAllContactMessages();

        if (!contactMessageResponses.isEmpty()) {
            return ResponseEntity.ok(contactMessageResponses);
        }
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<List<ContactMessageResponse>> getSearchedContactMessages(
            @RequestParam(required = false, value = "keyword") String keyword) {
        return ResponseEntity.ok(contactMessageService.getfilteredContactMessages(keyword));

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
