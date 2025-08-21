package com.sesac.solbid.controller;

import com.sesac.solbid.domain.User;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.dto.ApiResponse;

import com.sesac.solbid.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<ApiResponse<UserDto.SignupResponse>> signup(@Valid @RequestBody UserDto.SignupRequest requestDto) {
        User user = userService.signup(requestDto);
        UserDto.SignupResponse responseDto = new UserDto.SignupResponse(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseDto));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @Valid @RequestBody UserDto.LoginRequest requestDto,
            HttpServletResponse response) {
        
        UserDto.LoginResponse responseDto = userService.login(requestDto);

        // HttpOnly 쿠키로 토큰 설정
        setTokenCookies(response, responseDto.getAccessToken(), responseDto.getRefreshToken());

        // 응답에서는 토큰 제외하고 사용자 정보만 반환
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", responseDto.getUserId());
        userData.put("email", responseDto.getEmail());
        userData.put("nickname", responseDto.getNickname());
        userData.put("userType", responseDto.getUserType());

        return ResponseEntity.ok(ApiResponse.success(userData));
    }

    /**
     * HttpOnly 쿠키로 토큰 설정
     */
    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access Token 쿠키 설정
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);  // JavaScript 접근 차단
        accessTokenCookie.setSecure(false);   // 개발환경에서는 false, 운영환경에서는 true
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(3600);    // 1시간
        response.addCookie(accessTokenCookie);
        
        // Refresh Token 쿠키 설정
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);  // 개발환경에서는 false, 운영환경에서는 true
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(86400);  // 24시간
        response.addCookie(refreshTokenCookie);
    }

}