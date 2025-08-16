package com.sesac.solbid.controller;

import com.sesac.solbid.dto.ApiResponse;
import com.sesac.solbid.dto.OAuth2Dto;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.exception.OAuth2Exception;
import com.sesac.solbid.service.OAuth2Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
     * 로그아웃 처리
     * POST /api/auth/oauth2/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletResponse response) {
        
        log.info("로그아웃 요청");
        
        try {
            // 쿠키 삭제
            clearTokenCookies(response);
            
            log.info("로그아웃 완료");
            
            return ResponseEntity.ok(
                ApiResponse.success("로그아웃이 완료되었습니다.", "로그아웃이 완료되었습니다.")
            );
            
        } catch (Exception e) {
            log.error("로그아웃 처리 중 예외 발생", e);
            return ResponseEntity.internalServerError().body(
                ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
    }

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
        
        log.debug("HttpOnly 쿠키 설정 완료: accessToken({}초), refreshToken({}초)", 3600, 86400);
    }

    /**
     * 토큰 쿠키 삭제 (로그아웃)
     */
    private void clearTokenCookies(HttpServletResponse response) {
        // Access Token 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", "");
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(false);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);  // 즉시 만료
        response.addCookie(accessTokenCookie);
        
        // Refresh Token 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", "");
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);  // 즉시 만료
        response.addCookie(refreshTokenCookie);
        
        log.debug("HttpOnly 쿠키 삭제 완료");
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
    public ResponseEntity<ApiResponse<OAuth2Dto.LoginSuccessResponse>> handleCallback(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2Dto.CallbackRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String clientIp = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        log.info("OAuth2 콜백 처리 요청: provider={}, clientIp={}, userAgent={}, state={}", 
                provider, clientIp, maskUserAgent(userAgent), maskState(request.getState()));
        
        try {
            UserDto.LoginResponse response = oAuth2Service.processCallback(
                provider, request.getCode(), request.getState()
            );
            
            // HttpOnly 쿠키로 토큰 설정
            setTokenCookies(httpResponse, response.getAccessToken(), response.getRefreshToken());
            
            // 응답에서는 토큰 제외하고 사용자 정보만 반환
            OAuth2Dto.LoginSuccessResponse loginSuccessResponse = OAuth2Dto.LoginSuccessResponse.builder()
                    .userId(response.getUserId())
                    .email(response.getEmail())
                    .nickname(response.getNickname())
                    .userType(response.getUserType())
                    .provider(provider)
                    .build();
            
            log.info("OAuth2 콜백 처리 성공: provider={}, clientIp={}, userId={}, email={}", 
                    provider, clientIp, response.getUserId(), maskEmail(response.getEmail()));
            
            return ResponseEntity.ok(
                ApiResponse.success(loginSuccessResponse, "소셜로그인이 완료되었습니다.")
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