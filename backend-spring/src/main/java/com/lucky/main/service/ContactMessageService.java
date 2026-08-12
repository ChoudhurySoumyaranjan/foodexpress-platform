package com.lucky.main.service;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ContactMessageService {

    ContactMessageResponse saveContactMessage(ContactMessageRequest contactMessageRequest);

    List<TicketSubject> getAllTicketSubjects();

    List<TicketStatus> getAllTicketStatuses();

    Page<ContactMessageResponse> getAllContactMessages(Pageable pageable);

    ContactMessageResponse updateContactMessage(Long id, TicketStatus ticketStatus);

    Page<ContactMessageResponse> getfilteredContactMessages(String keyword,Pageable pageable);

    Long getTotalContactMessageCount();


    long getPendingQueriesCount();
}
