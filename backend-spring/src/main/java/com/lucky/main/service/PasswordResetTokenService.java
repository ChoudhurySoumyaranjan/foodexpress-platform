package com.lucky.main.service;

import com.lucky.main.entity.PasswordResetToken;
import com.lucky.main.entity.User;

import java.util.Optional;

public interface PasswordResetTokenService {

    PasswordResetToken createToken(User user);

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);

    void delete(PasswordResetToken token);

}