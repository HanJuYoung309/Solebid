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
            log.warn("OAuth2 state 검증 실패: state가 null 또는 빈 값 - 잠재적 CSRF 공격 시도");
            throw new OAuth2StateException();
        }

        StateInfo stateInfo = stateStore.get(state);
        
        if (stateInfo == null) {
            log.warn("OAuth2 state 검증 실패: 존재하지 않는 state - {} - 잠재적 CSRF 공격 시도", maskState(state));
            throw new OAuth2StateException();
        }

        if (stateInfo.isExpired()) {
            log.warn("OAuth2 state 검증 실패: 만료된 state - {} - 만료시간: {}", 
                    maskState(state), stateInfo.getExpiryTime());
            stateStore.remove(state); // 만료된 state 제거
            throw new OAuth2StateException();
        }

        log.debug("OAuth2 state 검증 성공: {} - 생성시간: {}", 
                maskState(state), stateInfo.getCreatedTime());
        return true;
    }

    /**
     * state 파라미터 소비(검증+삭제) - 원자적 처리로 동시 요청 차단
     * @param state 소비할 state 값
     */
    public void consumeState(String state) {
        if (state == null || state.trim().isEmpty()) {
            log.warn("OAuth2 state 소비 실패: state가 null 또는 빈 값");
            throw new OAuth2StateException();
        }
        // remove는 기존 값을 반환하므로 검증과 삭제를 원자적으로 처리할 수 있음
        StateInfo stateInfo = stateStore.remove(state);
        if (stateInfo == null) {
            log.warn("OAuth2 state 소비 실패: 존재하지 않거나 이미 소비된 state - {}", maskState(state));
            throw new OAuth2StateException();
        }
        if (stateInfo.isExpired()) {
            log.warn("OAuth2 state 소비 실패: 만료된 state - {} - 만료시간: {}", maskState(state), stateInfo.getExpiryTime());
            throw new OAuth2StateException();
        }
        log.debug("OAuth2 state 소비 성공: {}", maskState(state));
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
        AtomicInteger totalCount = new AtomicInteger(stateStore.size());
        
        stateStore.entrySet().removeIf(entry -> {
            if (entry.getValue().isExpired()) {
                removedCount.incrementAndGet();
                return true;
            }
            return false;
        });
        
        int removed = removedCount.get();
        int remaining = stateStore.size();
        
        if (removed > 0) {
            log.info("OAuth2 state 정리 완료 - 만료: {}, 유지: {}, 전체: {}", 
                    removed, remaining, totalCount.get());
        }
        
        // 보안 모니터링: 비정상적으로 많은 state가 쌓이는 경우 경고
        if (remaining > 1000) {
            log.warn("OAuth2 state 개수가 비정상적으로 많음: {} - 잠재적 공격 가능성 검토 필요", remaining);
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
        private final LocalDateTime createdTime;
        private final LocalDateTime expiryTime;

        public StateInfo(LocalDateTime expiryTime) {
            this.createdTime = LocalDateTime.now();
            this.expiryTime = expiryTime;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }

        public LocalDateTime getCreatedTime() {
            return createdTime;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}