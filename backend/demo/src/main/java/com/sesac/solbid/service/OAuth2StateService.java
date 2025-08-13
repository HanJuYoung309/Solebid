package com.sesac.solbid.service;

import com.sesac.solbid.exception.OAuth2StateException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * OAuth2 State 파라미터 관리 서비스
 * CSRF 공격 방지를 위한 state 생성, 검증, 삭제 기능 제공
 */
@Slf4j
@Service
public class OAuth2StateService {

    private static final int STATE_TTL_MINUTES = 15;
    
    // 메모리 기반 state 저장소 (실제 운영환경에서는 Redis 사용 권장)
    private final Map<String, StateInfo> stateStore = new ConcurrentHashMap<>();

    /**
     * 새로운 state 파라미터 생성
     * @return UUID 기반 state 문자열
     */
    public String generateState() {
        String state = UUID.randomUUID().toString();
        StateInfo stateInfo = new StateInfo(LocalDateTime.now().plusMinutes(STATE_TTL_MINUTES));
        
        stateStore.put(state, stateInfo);
        
        log.debug("OAuth2 state 생성: {}", maskState(state));
        return state;
    }

    /**
     * state 파라미터 검증
     * @param state 검증할 state 값
     * @return 유효한 state인 경우 true
     * @throws OAuth2StateException state가 유효하지 않은 경우
     */
    public boolean validateState(String state) {
        if (state == null || state.trim().isEmpty()) {
            log.warn("OAuth2 state 검증 실패: state가 null 또는 빈 값");
            throw new OAuth2StateException();
        }

        StateInfo stateInfo = stateStore.get(state);
        
        if (stateInfo == null) {
            log.warn("OAuth2 state 검증 실패: 존재하지 않는 state - {}", maskState(state));
            throw new OAuth2StateException();
        }

        if (stateInfo.isExpired()) {
            log.warn("OAuth2 state 검증 실패: 만료된 state - {}", maskState(state));
            stateStore.remove(state); // 만료된 state 제거
            throw new OAuth2StateException();
        }

        log.debug("OAuth2 state 검증 성공: {}", maskState(state));
        return true;
    }

    /**
     * state 파라미터 삭제 (사용 후 즉시 삭제)
     * @param state 삭제할 state 값
     */
    public void removeState(String state) {
        if (state != null) {
            stateStore.remove(state);
            log.debug("OAuth2 state 삭제: {}", maskState(state));
        }
    }

    /**
     * 만료된 state들을 정리하는 메서드
     * 매 10분마다 자동 실행
     */
    @Scheduled(fixedRate = 600000) // 10분 = 600,000ms
    public void cleanupExpiredStates() {
        AtomicInteger removedCount = new AtomicInteger(0);
        
        stateStore.entrySet().removeIf(entry -> {
            if (entry.getValue().isExpired()) {
                removedCount.incrementAndGet();
                return true;
            }
            return false;
        });
        
        int removed = removedCount.get();
        if (removed > 0) {
            log.info("만료된 OAuth2 state {} 개 정리 완료", removed);
        }
    }

    /**
     * 현재 저장된 state 개수 반환 (모니터링 용도)
     */
    public int getStateCount() {
        return stateStore.size();
    }

    /**
     * 보안을 위해 state 값을 마스킹 처리
     */
    private String maskState(String state) {
        if (state == null || state.length() < 8) {
            return "****";
        }
        return state.substring(0, 4) + "****" + state.substring(state.length() - 4);
    }

    /**
     * State 정보를 담는 내부 클래스
     */
    private static class StateInfo {
        private final LocalDateTime expiryTime;

        public StateInfo(LocalDateTime expiryTime) {
            this.expiryTime = expiryTime;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }
}