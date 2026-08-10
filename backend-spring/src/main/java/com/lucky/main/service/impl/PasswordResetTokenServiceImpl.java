package com.lucky.main.service.impl;

import com.lucky.main.entity.PasswordResetToken;
import com.lucky.main.entity.User;
import com.lucky.main.repository.PasswordResetTokenRepository;
import com.lucky.main.service.PasswordResetTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {

    private static final int TOKEN_EXPIRY_MINUTES = 50;

    private final PasswordResetTokenRepository repository;

    @Override
    @Transactional
    public PasswordResetToken createToken(User user) {

        repository.deleteByUser(user);

        PasswordResetToken token = new PasswordResetToken();

        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(
                LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES)
        );

        return repository.save(token);
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return repository.findByToken(token);
    }

    @Override
    @Transactional
    public void deleteByUser(User user) {
        repository.deleteByUser(user);
    }

    @Override
    public void delete(PasswordResetToken token) {
        repository.delete(token);
    }
}