package com.sesac.solbid.dto;

import com.sesac.solbid.domain.User;
import com.sesac.solbid.domain.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

        public LoginResponse(User user, String accessToken, String refreshToken) {
            this.userId = user.getUserId();
            this.email = user.getEmail();
            this.nickname = user.getNickname();
            this.userType = user.getUserType();
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}