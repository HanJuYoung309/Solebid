package com.sesac.solbid.exception;

/**
 * OAuth2 State 파라미터 관련 보안 예외 클래스
 * CSRF 공격 방지를 위한 state 검증 실패 시 사용
 */
public class OAuth2StateException extends OAuth2Exception {

    public OAuth2StateException() {
        super(ErrorCode.OAUTH2_STATE_MISMATCH);
    }
}