package com.lucky.main.service;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;

import java.util.List;

public interface ContactMessageService {

    ContactMessageResponse saveContactMessage(ContactMessageRequest contactMessageRequest);

    List<TicketSubject> getAllTicketSubjects();

    List<TicketStatus> getAllTicketStatuses();

    List<ContactMessageResponse> getAllContactMessages();

    ContactMessageResponse updateContactMessage(Long id, TicketStatus ticketStatus);

    List<ContactMessageResponse> getfilteredContactMessages(String keyword);

    Long getTotalContactMessageCount();


    long getPendingQueriesCount();
}
