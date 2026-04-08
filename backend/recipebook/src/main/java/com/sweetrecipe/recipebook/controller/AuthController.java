package com.sweetrecipe.recipebook.controller;

import com.sweetrecipe.recipebook.dto.request.LoginRequest;
import com.sweetrecipe.recipebook.dto.request.SignUpRequest;
import com.sweetrecipe.recipebook.dto.response.LoginResponse;
import com.sweetrecipe.recipebook.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody SignUpRequest request) {
        Long userId = authService.signUp(request);
        return ResponseEntity.created(URI.create("/api/users/" + userId)).build();
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "로그아웃", description = "클라이언트에서 토큰을 삭제합니다.")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
