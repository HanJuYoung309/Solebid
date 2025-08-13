package com.sesac.solbid.exception;

/**
 * OAuth2 소셜로그인 관련 예외 클래스
 */
public class OAuth2Exception extends CustomException {

    public OAuth2Exception(ErrorCode errorCode) {
        super(errorCode);
    }
}