package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"net/url"
	"sync/atomic"
)

func LoggingHTTP(header http.Header, bodyBytes []byte) {
	log.Println("Request Headers:")
	for name, values := range header {
		for _, value := range values {
			log.Printf("%s: %s", name, value)
		}
	}

	log.Printf("Request Body: %s", string(bodyBytes))
}

func (app *Config) Broker(w http.ResponseWriter, r *http.Request) {
	// 요청 횟수를 증가시키고 로그로 출력
	atomic.AddUint64(&app.requestCount, 1)

	// 요청이 발생하였을 경우 필요하다고 생각되는 데이터를 출력한다.

	log.Println("================== Request Data =============================")

	// 1. 컨테이너 실행 후 요청 횟수
	log.Printf("Request Total Count : %d", app.requestCount)

	// 2. 요청 경로
	log.Printf("Request Path: %s", r.URL.Path)

	// 3. 요청 헤더
	log.Println("=============================================================")
	log.Println("Incoming Request Headers")
	for name, values := range r.Header {
		for _, value := range values {
			log.Printf("%s: %s", name, value)
		}
	}

	log.Println("=============================================================")

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	// 요청 바디를 다시 io.Reader로 변환 (읽기 후 재사용)
	r.Body = io.NopCloser(bytes.NewReader(bodyBytes))

	// 원본 요청 URL을 해석하고, targetURL로 전달할 새로운 요청을 생성합니다.
	url, _ := url.Parse(targetURL)

	proxyReq, err := http.NewRequest(r.Method, url.String()+r.RequestURI, r.Body)
	if err != nil {
		http.Error(w, "Error creating proxy request", http.StatusInternalServerError)
		return
	}

	// 원본 요청 헤더를 복사합니다.
	proxyReq.Header = r.Header

	client := &http.Client{}
	proxyRes, err := client.Do(proxyReq)
	if err != nil {
		http.Error(w, "Error forwarding request", http.StatusBadGateway)
		return
	}
	defer proxyRes.Body.Close()

	// 응답 헤더를 복사합니다.
	for key, value := range proxyRes.Header {
		for _, v := range value {
			w.Header().Add(key, v)
		}
	}

	responseBodyBytes, err := io.ReadAll(proxyRes.Body)
	if err != nil {
		http.Error(w, "Error reading response body", http.StatusInternalServerError)
		return
	}

	// 응답 상태 코드와 본문을 클라이언트에게 전달합니다.
	w.WriteHeader(proxyRes.StatusCode)
	w.Write(responseBodyBytes)
}
