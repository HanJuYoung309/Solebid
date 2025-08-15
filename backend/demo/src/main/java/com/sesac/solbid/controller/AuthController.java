package com.sesac.solbid.controller;

import com.sesac.solbid.dto.ApiResponse;
import com.sesac.solbid.dto.OAuth2Dto;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.exception.OAuth2Exception;
import com.sesac.solbid.service.OAuth2Service;
import jakarta.servlet.http.HttpServletRequest;
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
     * 클라이언트 IP 주소 추출 (프록시 고려)
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * User-Agent 마스킹 처리 (보안)
     */
    private String maskUserAgent(String userAgent) {
        if (userAgent == null || userAgent.length() < 20) {
            return "****";
        }
        return userAgent.substring(0, 10) + "****" + userAgent.substring(userAgent.length() - 6);
    }

    /**
     * State 값 마스킹 처리 (보안)
     */
    private String maskState(String state) {
        if (state == null || state.length() < 8) {
            return "****";
        }
        return state.substring(0, 4) + "****" + state.substring(state.length() - 4);
    }

    /**
     * 이메일 마스킹 처리 (보안)
     */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "****";
        }
        
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];
        
        if (localPart.length() <= 2) {
            return "**@" + domain;
        }
        
        return localPart.substring(0, 2) + "****@" + domain;
    }

    /**
     * OAuth2 인증 URL 생성
     * GET /api/auth/oauth2/{provider}/url
     * 
     * @param provider 소셜 플랫폼 이름 (google, kakao)
     * @return 인증 URL과 state 정보
     */
    @GetMapping("/{provider}/url")
    public ResponseEntity<ApiResponse<OAuth2Dto.AuthUrlResponse>> generateAuthUrl(
            @PathVariable String provider,
            HttpServletRequest request) {
        
        String clientIp = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        log.info("OAuth2 인증 URL 생성 요청: provider={}, clientIp={}, userAgent={}", 
                provider, clientIp, maskUserAgent(userAgent));
        
        try {
            OAuth2Dto.AuthUrlResponse response = oAuth2Service.generateAuthUrl(provider);
            
            log.info("OAuth2 인증 URL 생성 성공: provider={}, clientIp={}, state={}", 
                    provider, clientIp, maskState(response.getState()));
            
            return ResponseEntity.ok(
                ApiResponse.success(response, "OAuth2 인증 URL이 생성되었습니다.")
            );
            
        } catch (OAuth2Exception e) {
            log.warn("OAuth2 인증 URL 생성 실패: provider={}, clientIp={}, error={}", 
                    provider, clientIp, e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getErrorCode().name(), e.getMessage())
            );
        } catch (Exception e) {
            log.error("OAuth2 인증 URL 생성 중 예외 발생: provider={}, clientIp={}", 
                    provider, clientIp, e);
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
            @Valid @RequestBody OAuth2Dto.CallbackRequest request,
            HttpServletRequest httpRequest) {
        
        String clientIp = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        log.info("OAuth2 콜백 처리 요청: provider={}, clientIp={}, userAgent={}, state={}", 
                provider, clientIp, maskUserAgent(userAgent), maskState(request.getState()));
        
        try {
            UserDto.LoginResponse response = oAuth2Service.processCallback(
                provider, request.getCode(), request.getState()
            );
            
            log.info("OAuth2 콜백 처리 성공: provider={}, clientIp={}, userId={}, email={}", 
                    provider, clientIp, response.getUserId(), maskEmail(response.getEmail()));
            
            return ResponseEntity.ok(
                ApiResponse.success(response, "소셜로그인이 완료되었습니다.")
            );
            
        } catch (OAuth2Exception e) {
            log.warn("OAuth2 콜백 처리 실패: provider={}, clientIp={}, error={}, state={}", 
                    provider, clientIp, e.getMessage(), maskState(request.getState()));
            return ResponseEntity.badRequest().body(
                ApiResponse.error(e.getErrorCode().name(), e.getMessage())
            );
        } catch (Exception e) {
            log.error("OAuth2 콜백 처리 중 예외 발생: provider={}, clientIp={}, state={}", 
                    provider, clientIp, maskState(request.getState()), e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
    }


}