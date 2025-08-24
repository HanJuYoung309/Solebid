import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NicknameSetup: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 간단 유효성
  const isBasicValid = useMemo(() => {
    return nickname.trim().length >= 2 && nickname.trim().length <= 10 && !nickname.startsWith('user_');
  }, [nickname]);

  const checkAvailability = async (value: string) => {
    if (!value || value.trim().length < 2) {
      setAvailable(null);
      return;
    }
    try {
      setChecking(true);
      const res = await fetch(`/api/users/nickname/available?nickname=${encodeURIComponent(value.trim())}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAvailable(Boolean(data.data?.available));
      } else {
        setAvailable(false);
      }
    } catch (e) {
      console.debug('닉네임 중복 확인 실패', e);
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      if (isBasicValid) checkAvailability(nickname);
    }, 300);
    return () => clearTimeout(handle);
  }, [nickname, isBasicValid]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isBasicValid) {
      setError('닉네임은 2~10자이며 user_로 시작할 수 없습니다.');
      return;
    }
    if (available === false) {
      setError('이미 사용 중인 닉네임입니다.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/users/nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname: nickname.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // 헤더 즉시 반영: 세션 캐시 갱신 및 이벤트 발행
        try {
          const cachedRaw = sessionStorage.getItem('auth.user');
          const merged = { ...(cachedRaw ? JSON.parse(cachedRaw) : {}), ...(data.data || {}), nickname: data.data?.nickname || nickname.trim() };
          sessionStorage.setItem('auth.user', JSON.stringify(merged));
          const evt = new CustomEvent('auth-changed', { detail: { user: merged } });
          window.dispatchEvent(evt);
        } catch (e) {
          console.debug('닉네임 설정 후 세션 갱신 실패', e);
        }
        // 메인으로 이동 (전체 새로고침 제거)
        navigate('/');
      } else {
        setError(data.message || '닉네임 설정에 실패했습니다.');
      }
    } catch (e) {
      console.debug('닉네임 설정 요청 실패', e);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-edit text-2xl text-blue-600"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">닉네임 설정</h3>
          <p className="text-gray-600 text-sm">다른 사용자와 구분될 고유한 닉네임을 입력하세요.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => { setNickname(e.target.value); setError(null); }}
                placeholder="2~10자, 영문/숫자/한글"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                maxLength={10}
                autoFocus
              />
              {checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  <i className="fas fa-spinner fa-spin" />
                </div>
              )}
            </div>
            {available === true && isBasicValid && (
              <p className="text-green-600 text-xs mt-1">사용 가능한 닉네임입니다.</p>
            )}
            {available === false && (
              <p className="text-red-500 text-xs mt-1">이미 사용 중인 닉네임입니다.</p>
            )}
            {!isBasicValid && nickname.length > 0 && (
              <p className="text-red-500 text-xs mt-1">닉네임은 2~10자이며 user_로 시작할 수 없습니다.</p>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting || !isBasicValid || available === false}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {submitting ? (<><i className="fas fa-spinner fa-spin mr-2" />설정 중...</>) : '닉네임 설정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknameSetup;
