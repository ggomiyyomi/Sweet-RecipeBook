# 🍽️ 맛을 재현하다

## 1. 서비스 소개

### 📌 한 줄 설명

개인의 추억과 취향이 담긴 레시피를 기록하고, 이를 책으로 제작하여 실제로 소장할 수 있는 서비스

### 🎯 타겟 사용자

- 자신만의 요리 레시피를 체계적으로 기록하고 싶은 사용자
- 가족의 요리, 추억이 담긴 레시피를 보존하고 싶은 사람
- 요리를 단순 기록이 아닌 “경험”으로 남기고 싶은 사용자
- 유명 크리에이터 또는 요리사의 레시피를 공유하고 싶은 사람

### 💡 핵심 가치

“개인의 기억과 취향이 담긴 레시피를 책으로 남기는 경험”

---

## 🧠 서비스 컨셉

- 단순 레시피 저장 서비스 ❌
- 개인의 기억과 취향을 담는 레시피 기반 기록 서비스 ⭕
- 결과물: 실제 책 형태로 남는 경험

---

## ⚙️ 주요 기능 (추후 사진 추가 예정)

### 1. 레시피 입력 기능

---

### 2. INDEX (카테고리) 기능

---

### 3. 레시피북 구조 구성 기능

---

### 4. 책 생성 및 주문 기능

---

### 5. 로그인 및 사용자 관리 (마이페이지)

---

## 🔄 사용자 흐름

1. 사용자는 로그인한다
2. 레시피를 입력하고 저장한다
3. INDEX를 통해 레시피를 분류한다
4. 레시피를 선택하고 순서를 정렬하여 레시피북을 구성한다
5. 책 생성 기능을 통해 레시피북을 생성한다
6. 생성된 책을 확인하고 주문한다

---

## 2. 실행 방법

### 요구 사항

- Java 21
- Node.js 18+
- MySQL 8.0+

### 백엔드

```bash
# 데이터베이스 설정
# MySQL에서 아래 파일 순서대로 실행
mysql -u root -p < db/schema.sql
mysql -u root -p RecipeBook < db/dummy-data.sql

# 환경변수 설정
cp backend/recipebook/.env.example backend/recipebook/.env
# .env 파일에 DB 정보 및 API Key 입력

# 실행
cd backend/recipebook
./gradlew bootRun
```

백엔드 서버: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui/index.html

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

프론트엔드: http://localhost:5173

### 테스트 계정 (더미데이터 기준)

| 이메일 | 비밀번호 |
|--------|----------|
| kim@test.com | test1234 |
| lee@test.com | test1234 |
| park@test.com | test1234 |

---

## 3. 사용한 API 목록

### 인증
| 메서드 | URL | 설명 | 인증 (토큰 여부) |
|--------|-----|------|------|
| POST | `/api/auth/signup` | 회원가입 | 불필요 |
| POST | `/api/auth/login` | 로그인 | 불필요 |
| POST | `/api/auth/logout` | 로그아웃 | 필요 |

### 레시피
| 메서드 | URL | 설명 | 인증 (토큰 여부) |
|--------|-----|------|------|
| POST | `/api/recipes` | 레시피 등록 | 필요 |
| GET | `/api/recipes` | 내 레시피 목록 조회 | 필요 |
| GET | `/api/recipes/{recipeId}` | 레시피 상세 조회 | 필요 |
| PUT | `/api/recipes/{recipeId}` | 레시피 수정 | 필요 |
| DELETE | `/api/recipes/{recipeId}` | 레시피 삭제 | 필요 |

### 레시피북
| 메서드 | URL | 설명 | 인증 (토큰 여부) |
|--------|-----|------|------|
| POST | `/api/books` | 책 생성 (SweetBook 연동) | 필요 |
| GET | `/api/books` | 내 책 목록 조회 | 필요 |
| GET | `/api/books/{recipeBookId}` | 책 상세 조회 | 필요 |
| PUT | `/api/books/{recipeBookId}` | 책 제목 수정 | 필요 |
| DELETE | `/api/books/{recipeBookId}` | 책 삭제 | 필요 |
| GET | `/api/books/specs` | 판형 목록 조회 (SweetBook) | 필요 |
| GET | `/api/books/templates` | 템플릿 목록 조회 (SweetBook) | 필요 |
| GET | `/api/books/templates/{templateUid}` | 템플릿 상세 조회 (SweetBook) | 필요 |

### 주문
| 메서드 | URL | 설명 | 인증 (토큰 여부) |
|--------|-----|------|------|
| POST | `/api/orders` | 주문 생성 | 필요 |
| GET | `/api/orders` | 내 주문 목록 조회 | 필요 |
| GET | `/api/orders/{orderId}` | 주문 단건 조회 | 필요 |
| POST | `/api/orders/{orderId}/cancel` | 주문 취소 | 필요 |
| PATCH | `/api/orders/{orderId}/shipping` | 배송지 수정 | 필요 |

### 웹훅
| 메서드 | URL | 설명 | 인증 (토큰 여부) |
|--------|-----|------|------|
| POST | `/api/webhooks/orders` | SweetBook 주문 상태 동기화 | 불필요 |

---

## 4. AI 도구 사용 내역

| AI 도구     | 활용 내용                                               |
| ----------- | ------------------------------------------------------- |
| ChatGPT     | 기획 정리 및 개발 방향 설정, 트러블슈팅, 주요 조사 도구 |
| Claude Code | 프로젝트 구조 설계 및 코드 생성                         |
| Gemini      | 보조 조사                                               |
| Liner       | 초기 시장 조사 및 서비스 차별성 분석                    |

---

## 5. 설계 의도

### 서비스 선택 이유

요리는 단순한 레시피를 넘어 개인의 경험과 기억이 담긴 활동이다.  
하지만 기존 서비스들은 이를 구조적으로 저장하거나 장기적으로 보존하는 데 한계가 있다.  
특히 가족의 요리처럼 감정이 담긴 레시피는 시간이 지날수록 쉽게 잊히기 때문에,  
이를 기록하고 다시 재현할 수 있는 서비스가 필요하다고 판단하였다.

---

### 비즈니스 가능성

- 개인 소장형 레시피북 제작
- 요리 크리에이터 협업 가능
- 향후 구독형 콘텐츠 서비스 확장 가능

---

### 향후 확장 기능

- 로그인 security 고도화
- AI 기반 칼로리 분석
- 음성 입력 레시피 작성
- 레시피 이미지 생성
- 다국어 번역 기능
- 개인 맞춤 추천 시스템
- PDF → 레시피 자동 변환 기능
