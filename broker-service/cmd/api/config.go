package main

func (app *Config) Init() {
	app.requestCount = 0
	app.apiUrl = "http://api-service:4000"
}
