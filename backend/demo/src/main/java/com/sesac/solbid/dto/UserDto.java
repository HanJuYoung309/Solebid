// src/main/java/com/sesac/solbid/dto/UserDto.java

package com.sesac.solbid.dto;

import com.sesac.solbid.domain.User;
import com.sesac.solbid.domain.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class SignupRequest {

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        private String email;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}$",
                message = "비밀번호는 8~20자 영문 대소문자, 숫자, 특수문자를 사용하세요.")
        private String password;

        @NotBlank(message = "닉네임은 필수 입력 값입니다.")
        @Size(min = 2, max = 10, message = "닉네임은 2자 이상 10자 이하로 입력해주세요.")
        private String nickname;

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        private String name;

        @NotBlank(message = "전화번호는 필수 입력 값입니다.")
        @Pattern(regexp = "^01(?:0|1|[6-9])[0-9]{7,8}$", message = "전화번호 형식이 올바르지 않습니다.")
        private String phone;

        public User toEntity(String encodedPassword) {
            return User.builder()
                    .email(this.email)
                    .password(encodedPassword)
                    .nickname(this.nickname)
                    .name(this.name)
                    .phone(this.phone)
                    .build();
        }
    }

    @Getter
    public static class SignupResponse {
        private final Long userId;
        private final String email;
        private final String nickname;

        public SignupResponse(User user) {
            this.userId = user.getUserId();
            this.email = user.getEmail();
            this.nickname = user.getNickname();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        private String email;

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;
    }

    @Getter
    public static class LoginResponse {
        private final Long userId;
        private final String email;
        private final String nickname;
        private final UserType userType;
        private final String accessToken;
        private final String refreshToken;

        @Builder
        public LoginResponse(Long userId, String email, String nickname, UserType userType, String accessToken, String refreshToken) {
            this.userId = userId;
            this.email = email;
            this.nickname = nickname;
            this.userType = userType;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        // 일반 로그인과 소셜 로그인 모두 이 DTO를 사용하도록 from 메서드 추가
        public static LoginResponse from(User user, String accessToken, String refreshToken) {
            return LoginResponse.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .userType(user.getUserType())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }
    }

    // 소셜 로그인 요청을 위한 DTO (기존 호환성 유지)
    @Getter
    @Setter
    @NoArgsConstructor
    public static class SocialLoginRequest {
        @NotBlank(message = "소셜 플랫폼 정보는 필수입니다.")
        private String provider;
        
        @NotBlank(message = "인증 코드는 필수입니다.")
        private String authCode;

        @Builder
        public SocialLoginRequest(String provider, String authCode) {
            this.provider = provider;
            this.authCode = authCode;
        }
    }

    /**
     * 소셜로그인 성공 응답 DTO
     * 일반 LoginResponse와 동일하지만 소셜로그인 특화 정보 추가 가능
     */
    @Getter
    public static class SocialLoginResponse {
        private final Long userId;
        private final String email;
        private final String nickname;
        private final UserType userType;
        private final String accessToken;
        private final String refreshToken;
        private final String provider;
        private final boolean isNewUser;

        @Builder
        public SocialLoginResponse(Long userId, String email, String nickname, UserType userType, 
                                 String accessToken, String refreshToken, String provider, boolean isNewUser) {
            this.userId = userId;
            this.email = email;
            this.nickname = nickname;
            this.userType = userType;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.provider = provider;
            this.isNewUser = isNewUser;
        }

        /**
         * User와 토큰 정보로부터 SocialLoginResponse 생성
         */
        public static SocialLoginResponse from(User user, String accessToken, String refreshToken, 
                                             String provider, boolean isNewUser) {
            return SocialLoginResponse.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .userType(user.getUserType())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .provider(provider)
                    .isNewUser(isNewUser)
                    .build();
        }
    }

    // 닉네임 변경 요청 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class NicknameUpdateRequest {
        @NotBlank(message = "닉네임은 필수 입력 값입니다.")
        @Size(min = 2, max = 10, message = "닉네임은 2자 이상 10자 이하로 입력해주세요.")
        private String nickname;
    }

    // 닉네임 가용성 응답 DTO
    @Getter
    @Builder
    public static class NicknameAvailabilityResponse {
        private final boolean available;
    }
}
