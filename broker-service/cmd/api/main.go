package main

import (
	"fmt"
	"log"
	"net/http"
)

const webPort = 2719

type Config struct {
	requestCount uint64
}

func main() {
	app := Config{}

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
