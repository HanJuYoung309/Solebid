#!/bin/bash

# 스크립트 사용법: ./create_feature.sh [feature-name]

# feature 이름이 인자로 전달되었는지 확인
if [ -z "$1" ]; then
  echo "오류: feature 이름을 입력해주세요."
  echo "사용법: $0 [feature-name]"
  exit 1
fi

FEATURE_NAME=$1
BASE_PATH="src/features"
TARGET_PATH="$BASE_PATH/$FEATURE_NAME"

# feature 폴더 및 하위 폴더들 생성
mkdir -p "$TARGET_PATH/components"
mkdir -p "$TARGET_PATH/hooks"
mkdir -p "$TARGET_PATH/pages"
mkdir -p "$TARGET_PATH/services"
mkdir -p "$TARGET_PATH/types"

echo "✅ '$TARGET_PATH' 에 새로운 feature 폴더 구조가 생성되었습니다."
