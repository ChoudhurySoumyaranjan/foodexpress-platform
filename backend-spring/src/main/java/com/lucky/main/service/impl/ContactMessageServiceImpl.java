package com.lucky.main.service.impl;

import com.lucky.main.dto.ContactMessageRequest;
import com.lucky.main.dto.ContactMessageResponse;
import com.lucky.main.dto.PageResponse;
import com.lucky.main.entity.ContactMessage;
import com.lucky.main.enums.TicketStatus;
import com.lucky.main.enums.TicketSubject;
import com.lucky.main.exception.contactus.ContactUsException;
import com.lucky.main.mapper.ContactMessageMapper;
import com.lucky.main.repository.ContactMessageRepository;
import com.lucky.main.service.ContactMessageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "contactMessagePage", allEntries = true),
                    @CacheEvict(value = "filteredContactMessagePage", allEntries = true)
            }
    )
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

    @Cacheable(
            value = "contactMessagePage",
            key = "#pageable.pageNumber + '-' + #pageable.pageSize"
    )
    @Override
    public PageResponse<ContactMessageResponse> getAllContactMessages(Pageable pageable) {

        try {
            Page<ContactMessageResponse> page = contactMessageRepository.findAll(pageable) //Page<ContactMessage>
                    .map(contactMessage -> ContactMessageMapper.toResponse(contactMessage)); //Page<ContactMessageResponse>

            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()  //PageResponse<ContactMessageResponse>

                    // returning Page<ContactMessageResponse> works perfectly.
                    // However, when we directly cache Page<ContactMessageResponse>
                    // in Redis, Spring Data usually uses the PageImpl implementation internally.
                    // GenericJackson2JsonRedisSerializer can serialize this object, but when reading it back from Redis,
                    // Jackson may not know how to reconstruct the PageImpl object.
            );

        } catch (Exception e) {
            throw new ContactUsException("Failed to get contact messages");
        }
    }


    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "contactMessagePage", allEntries = true),
                    @CacheEvict(value = "filteredContactMessagePage", allEntries = true)
            }
    )
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
    @Cacheable(
            value = "filteredContactMessagePage",
            key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + (#keyword == null ? '' : #keyword.trim().toLowerCase())"
    )
    public PageResponse<ContactMessageResponse> getfilteredContactMessages(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            Page<ContactMessageResponse> page = contactMessageRepository.findAll(pageable)
                    .map((contactMessage) -> ContactMessageMapper.toResponse(contactMessage));
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()  //PageResponse<ContactMessageResponse>

                    // returning Page<ContactMessageResponse> works perfectly.
                    // However, when we directly cache Page<ContactMessageResponse>
                    // in Redis, Spring Data usually uses the PageImpl implementation internally.
                    // GenericJackson2JsonRedisSerializer can serialize this object, but when reading it back from Redis,
                    // Jackson may not know how to reconstruct the PageImpl object.
            );
        } else {
            Page<ContactMessageResponse> page = contactMessageRepository.searchMessages(keyword.trim(), pageable)
                    .map((contactMessage) -> ContactMessageMapper.toResponse(contactMessage));
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast()  //PageResponse<ContactMessageResponse>

                    // returning Page<ContactMessageResponse> works perfectly.
                    // However, when we directly cache Page<ContactMessageResponse>
                    // in Redis, Spring Data usually uses the PageImpl implementation internally.
                    // GenericJackson2JsonRedisSerializer can serialize this object, but when reading it back from Redis,
                    // Jackson may not know how to reconstruct the PageImpl object.
            );
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