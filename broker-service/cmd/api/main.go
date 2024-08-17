package main

import (
	"fmt"
	"log"
	"net/http"
)

const webPort = 80

type Config struct {
	requestCount uint64
	apiUrl       string
}

func main() {
	app := Config{}
	app.Init()

	log.Printf("Starting broker service on port %d", webPort)

	// define http server

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", webPort),
		Handler: app.routes(),
	}

	// start the server
	err := srv.ListenAndServe()
	if err != nil {
		log.Panic(err)
	}
}
