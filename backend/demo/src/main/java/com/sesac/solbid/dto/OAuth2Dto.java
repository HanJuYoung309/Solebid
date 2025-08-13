package com.sesac.solbid.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * OAuth2 소셜로그인 관련 DTO 클래스
 */
public class OAuth2Dto {

    /**
     * OAuth2 인증 URL 응답 DTO
     */
    @Getter
    public static class AuthUrlResponse {
        private final String authUrl;
        private final String state;
        private final String provider;

        @Builder
        public AuthUrlResponse(String authUrl, String state, String provider) {
            this.authUrl = authUrl;
            this.state = state;
            this.provider = provider;
        }

        /**
         * 정적 팩토리 메서드
         */
        public static AuthUrlResponse of(String authUrl, String state, String provider) {
            return AuthUrlResponse.builder()
                    .authUrl(authUrl)
                    .state(state)
                    .provider(provider)
                    .build();
        }
    }

    /**
     * OAuth2 콜백 요청 DTO
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class CallbackRequest {
        
        @NotBlank(message = "인증 코드는 필수입니다.")
        private String code;
        
        @NotBlank(message = "State 파라미터는 필수입니다.")
        private String state;

        @Builder
        public CallbackRequest(String code, String state) {
            this.code = code;
            this.state = state;
        }
    }

    /**
     * OAuth2 에러 응답 DTO
     */
    @Getter
    public static class ErrorResponse {
        private final String error;
        private final String errorDescription;
        private final String provider;

        @Builder
        public ErrorResponse(String error, String errorDescription, String provider) {
            this.error = error;
            this.errorDescription = errorDescription;
            this.provider = provider;
        }

        /**
         * 정적 팩토리 메서드
         */
        public static ErrorResponse of(String error, String errorDescription, String provider) {
            return ErrorResponse.builder()
                    .error(error)
                    .errorDescription(errorDescription)
                    .provider(provider)
                    .build();
        }
    }

    /**
     * 지원하는 OAuth2 Provider 목록 응답 DTO
     */
    @Getter
    public static class ProvidersResponse {
        private final String[] supportedProviders;

        public ProvidersResponse(String[] supportedProviders) {
            this.supportedProviders = supportedProviders;
        }

        /**
         * 정적 팩토리 메서드
         */
        public static ProvidersResponse of(String[] supportedProviders) {
            return new ProvidersResponse(supportedProviders);
        }
    }
}