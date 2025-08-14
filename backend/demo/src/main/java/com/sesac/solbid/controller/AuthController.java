package com.sesac.solbid.controller;

import com.sesac.solbid.dto.ApiResponse;
import com.sesac.solbid.dto.OAuth2Dto;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.exception.OAuth2Exception;
import com.sesac.solbid.service.OAuth2Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * OAuth2 소셜로그인 인증 컨트롤러
 * 소셜로그인 URL 생성 및 콜백 처리를 담당
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/oauth2")
public class AuthController {

    private final OAuth2Service oAuth2Service;

    /**
     * OAuth2 인증 URL 생성
     * GET /api/auth/oauth2/{provider}/url
     * 
     * @param provider 소셜 플랫폼 이름 (google, kakao)
     * @return 인증 URL과 state 정보
     */
    @GetMapping("/{provider}/url")
    public ResponseEntity<ApiResponse<OAuth2Dto.AuthUrlResponse>> generateAuthUrl(
            @PathVariable String provider) {
        
        log.info("OAuth2 인증 URL 생성 요청: provider={}", provider);
        
        try {
            OAuth2Dto.AuthUrlResponse response = oAuth2Service.generateAuthUrl(provider);
            
            return ResponseEntity.ok(
                ApiResponse.success(response, "OAuth2 인증 URL이 생성되었습니다.")
            );
            
        } catch (OAuth2Exception e) {
            log.warn("OAuth2 인증 URL 생성 실패: provider={}, error={}", provider, e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getErrorCode().name(), e.getMessage())
            );
        } catch (Exception e) {
            log.error("OAuth2 인증 URL 생성 중 예외 발생: provider={}", provider, e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
    }

    /**
     * OAuth2 콜백 처리
     * POST /api/auth/oauth2/{provider}/callback
     * 
     * @param provider 소셜 플랫폼 이름 (google, kakao)
     * @param request 콜백 요청 (code, state)
     * @return 로그인 응답 (JWT 토큰 포함)
     */
    @PostMapping("/{provider}/callback")
    public ResponseEntity<ApiResponse<UserDto.LoginResponse>> handleCallback(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2Dto.CallbackRequest request) {
        
        log.info("OAuth2 콜백 처리 요청: provider={}", provider);
        
        try {
            UserDto.LoginResponse response = oAuth2Service.processCallback(
                provider, request.getCode(), request.getState()
            );
            
            return ResponseEntity.ok(
                ApiResponse.success(response, "소셜로그인이 완료되었습니다.")
            );
            
        } catch (OAuth2Exception e) {
            log.warn("OAuth2 콜백 처리 실패: provider={}, error={}", provider, e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getErrorCode().name(), e.getMessage())
            );
        } catch (Exception e) {
            log.error("OAuth2 콜백 처리 중 예외 발생: provider={}", provider, e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
    }


}