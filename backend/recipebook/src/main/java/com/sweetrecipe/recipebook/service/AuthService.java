package com.sweetrecipe.recipebook.service;

import com.sweetrecipe.recipebook.dto.request.LoginRequest;
import com.sweetrecipe.recipebook.dto.request.SignUpRequest;
import com.sweetrecipe.recipebook.dto.response.LoginResponse;
import com.sweetrecipe.recipebook.entity.User;
import com.sweetrecipe.recipebook.global.exception.CustomException;
import com.sweetrecipe.recipebook.global.exception.code.UserErrorCode;
import com.sweetrecipe.recipebook.global.jwt.JwtTokenProvider;
import com.sweetrecipe.recipebook.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Long signUp(SignUpRequest request) {
        if (userMapper.existsByEmail(request.getEmail())) {
            throw new CustomException(UserErrorCode.EMAIL_ALREADY_EXISTS);
        }

        SignUpRequest hashed = new SignUpRequest();
        hashed.setEmail(request.getEmail());
        hashed.setName(request.getName());
        hashed.setPassword(passwordEncoder.encode(request.getPassword()));

        userMapper.insertUser(hashed);
        return hashed.getUserId();
    }

    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            throw new CustomException(UserErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(UserErrorCode.INVALID_PASSWORD);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserId());
        return new LoginResponse(token, user.getUserId(), user.getName(), user.getEmail());
    }
}
