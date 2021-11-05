# Click Selector & Crawler

## 설치

<chrome://extensions> 에서 개발자모드 사용설정 후에 설치합니다.

## 기능

1. 크롤링 기능을 켜고 끌 수 있는 스위치
1. 현재 페이지의 크롤링 정보를 크롬 로컬 스토리지에 저장
1. 현재 페이지의 크롤링 정보와 캐시를 삭제
1. 현재까지의 모든 페이지 크롤링 목록을 디스크에 저장
1. 현재까지의 모든 페이지 크롤링 목록을 크롬 로컬 스토리지에서 삭제
1. 현재까지의 모든 페이지 크롤링 캐시를 크롬 로컬 스토리지에서 삭제

## 단축키

### 현재 페이지의 크롤링 정보를 크롬 로컬 스토리지에 저장

- Windows, Linux: Ctrl+Shift+S
- MacOS: Command+Shift+S

## 디버깅

- 페이지 상의 DOM Element를 선택할 때 마다 해당 페이지의 캐시가 콘솔에 출력됨
- 확장프로그램 팝업의 "Click Selector & Crawler" 제목을 클릭하면 크롬 로컬 스토리지에 저장된 모든 정보가 **팝업 콘솔**에 출력됨

## 저장파일 포맷

```json
{
  "https://example.com": {
    "p~~0": {
      "nth-child": 0,
      "selector": "p",
      "text": "This is an example."
    },
    "p~~1": {
      "nth-child": 1,
      "selector": "p",
      "text": "This is an example 2."
    }
  },
  "https://example.net": {
    "h1~~0": {
      "nth-child": 0,
      "selector": "h1",
      "text": "This is an example text."
    }
  }
}
```

## screenshot

![screenshot](https://user-images.githubusercontent.com/11364584/140268426-4204629b-bba2-4141-ac0e-0dce2a3e111f.png)
