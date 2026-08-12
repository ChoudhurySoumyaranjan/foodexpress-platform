package com.lucky.main.service.impl;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.entity.ContactMessage;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import com.lucky.main.exception.contactus.ContactUsException;
import com.lucky.main.mapper.ContactMessageMapper;
import com.lucky.main.repository.ContactMessageRepository;
import com.lucky.main.service.ContactMessageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public ContactMessageResponse saveContactMessage(
            ContactMessageRequest contactMessageRequest
    ) {

        try {

            ContactMessage contactMessage =
                    ContactMessageMapper.toEntity(contactMessageRequest);

            ContactMessage savedTicket =
                    contactMessageRepository.save(contactMessage);

            return ContactMessageMapper.toResponse(savedTicket);

        } catch (Exception e) {

            throw new ContactUsException(
                    "Failed to submit contact message"
            );
        }
    }

    @Override
    public List<TicketSubject> getAllTicketSubjects() {

        return Arrays.asList(TicketSubject.values());
    }

    @Override
    public List<TicketStatus> getAllTicketStatuses() {
        return Arrays.asList(TicketStatus.values());
    }

    @Override
    public Page<ContactMessageResponse> getAllContactMessages(Pageable pageable) {

        try {
            return contactMessageRepository.findAll(pageable)
                    .map(contactMessage -> ContactMessageMapper.toResponse(contactMessage));

        } catch (Exception e) {
            throw new ContactUsException("Failed to get contact messages");
        }
    }


    @Override
    public ContactMessageResponse updateContactMessage(Long id, TicketStatus ticketStatus) {

        ContactMessage contactMessage = contactMessageRepository
                .findById(id)
                .orElseThrow(() ->
                        new ContactUsException(
                                "Contact message with id " + id + " does not exist"
                        )
                );

        contactMessage.setStatus(ticketStatus);

        ContactMessage updatedMessage =
                contactMessageRepository.save(contactMessage);

        return ContactMessageMapper.toResponse(updatedMessage);
    }

    @Override
    @Transactional
    public Page<ContactMessageResponse> getfilteredContactMessages(String keyword,Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return contactMessageRepository.findAll(pageable)
                    .map((contactMessage) -> ContactMessageMapper.toResponse(contactMessage));
        } else {
            return contactMessageRepository.searchMessages(keyword.trim(),pageable)
                    .map((contactMessage) -> ContactMessageMapper.toResponse(contactMessage));
        }
    }

    @Override
    public Long getTotalContactMessageCount() {
        return contactMessageRepository.count();
    }

    @Override
    public long getPendingQueriesCount() {
        return contactMessageRepository.countByStatusIn(
                List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
        );
    }
}