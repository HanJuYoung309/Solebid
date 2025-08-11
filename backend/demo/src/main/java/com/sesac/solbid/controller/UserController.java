package com.sesac.solbid.controller;

import com.sesac.solbid.domain.User;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody UserDto.SignupRequest requestDto) {
        User user = userService.signup(requestDto);
        UserDto.SignupResponse responseDto = new UserDto.SignupResponse(user);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("is_success", true);
        responseBody.put("data", responseDto);
        responseBody.put("errorCode", null);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody UserDto.LoginRequest requestDto) {
        UserDto.LoginResponse responseDto = userService.login(requestDto);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("is_success", true);
        responseBody.put("data", responseDto);
        responseBody.put("errorCode", null);

        return ResponseEntity.ok(responseBody);
    }
}