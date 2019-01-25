package main

import (
	"./game"
	"./rpc"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type Proxy struct{}

func (proxy *Proxy) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	router := game.GetRouter()
	route := router.GetRandomRoute()
	for _, cookie := range req.Cookies() {
		if cookie.Name == "namespace" {
			route = router.GetRoute(cookie.Value)
		}
	}
	remoteUrl, _ := url.Parse("http://" + route.Host + ":" + route.Port)
	httputil.NewSingleHostReverseProxy(remoteUrl).ServeHTTP(res, req)
}

func startServer() {
	err := http.ListenAndServe(":8888", &Proxy{})
	if err != nil {
		log.Fatalln("ListenAndServe: ", err)
	}
}

func main() {
	go rpc.Serve()
	startServer()
}
