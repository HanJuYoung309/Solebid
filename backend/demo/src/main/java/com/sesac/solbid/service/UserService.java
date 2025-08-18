// src/main/java/com/sesac/solbid/service/UserService.java

package com.sesac.solbid.service;

import com.sesac.solbid.domain.SocialLogin;
import com.sesac.solbid.domain.User;
import com.sesac.solbid.domain.enums.ProviderType;
import com.sesac.solbid.domain.enums.UserStatus;
import com.sesac.solbid.domain.enums.UserType;
import com.sesac.solbid.dto.UserDto;
import com.sesac.solbid.exception.CustomException;
import com.sesac.solbid.exception.ErrorCode;
import com.sesac.solbid.repository.SocialLoginRepository;
import com.sesac.solbid.repository.UserRepository;
import com.sesac.solbid.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final SocialLoginRepository socialLoginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public User signup(UserDto.SignupRequest requestDto) {
        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }
        if (userRepository.findByNickname(requestDto.getNickname()).isPresent()) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());
        User user = requestDto.toEntity(encodedPassword);
        return userRepository.save(user);
    }

    @Transactional
    public UserDto.LoginResponse login(UserDto.LoginRequest requestDto) {
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGIN_FAILED));

        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.LOGIN_FAILED);
        }

        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new CustomException(ErrorCode.INACTIVE_USER);
        }

        // JwtUtil의 토큰 생성 메서드명에 맞춰 수정
        final String accessToken = jwtUtil.generateToken(user.getEmail());
        final String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return UserDto.LoginResponse.from(user, accessToken, refreshToken);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. id=" + userId));
    }

    @Transactional
    public User saveOrUpdate(String providerName, Map<String, Object> userAttributes) {
        // Provider 이름을 적절한 형태로 변환 (첫 글자만 대문자)
        String normalizedProviderName = providerName.substring(0, 1).toUpperCase() + providerName.substring(1).toLowerCase();
        ProviderType provider = ProviderType.valueOf(normalizedProviderName);
        
        String providerId = getProviderId(provider, userAttributes);
        String email = getEmail(provider, userAttributes);
        String nickname = getNickname(provider, userAttributes);

        Optional<SocialLogin> socialLoginOptional = socialLoginRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (socialLoginOptional.isPresent()) {
            user = socialLoginOptional.get().getUser();
        } else {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                user = userOptional.get();
            } else {
                // 새로운 유저 생성 시, name 필드를 nickname으로 설정
                user = User.builder()
                        .email(email)
                        .password(null) // 소셜 로그인은 비밀번호 없음
                        .nickname(nickname)
                        .name(nickname) // 이름 필드를 닉네임으로 초기화
                        .phone(null) // 전화번호 정보는 없으므로 null
                        .build();
                userRepository.save(user);
            }

            SocialLogin socialLogin = SocialLogin.builder()
                    .user(user)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            socialLoginRepository.save(socialLogin);
        }
        return user;
    }

    private String getProviderId(ProviderType provider, Map<String, Object> attributes) {
        if (provider == ProviderType.Google) {
            return (String) attributes.get("sub");
        }
        if (provider == ProviderType.Kakao) {
            return String.valueOf(attributes.get("id"));
        }
        throw new IllegalArgumentException("Unsupported Provider: " + provider);
    }

    private String getEmail(ProviderType provider, Map<String, Object> attributes) {
        if (provider == ProviderType.Google) {
            return (String) attributes.get("email");
        }
        if (provider == ProviderType.Kakao) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            return (String) kakaoAccount.get("email");
        }
        throw new IllegalArgumentException("Unsupported Provider: " + provider);
    }

    private String getNickname(ProviderType provider, Map<String, Object> attributes) {
        if (provider == ProviderType.Google) {
            return (String) attributes.get("name");
        }
        if (provider == ProviderType.Kakao) {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            return (String) properties.get("nickname");
        }
        throw new IllegalArgumentException("Unsupported Provider: " + provider);
    }
}
