package com.lucky.main.controller;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import com.lucky.main.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ContactMessageResponse> saveContactMessage(@Valid @RequestBody ContactMessageRequest contactMessageRequest) {

        ContactMessageResponse contactMessageResponse = contactMessageService.saveContactMessage(contactMessageRequest);

        return ResponseEntity.ok(contactMessageResponse);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<TicketSubject>> getAllTicketSubjects() {

        return ResponseEntity.ok(
                contactMessageService.getAllTicketSubjects()
        );
    }

    @GetMapping("/status")
    public ResponseEntity<List<TicketStatus>> getAllTicketStatus() {

        return ResponseEntity.ok(contactMessageService.getAllTicketStatuses());
    }

}