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
	var route game.Route
	for _, cookie := range req.Cookies() {
		if cookie.Name == "namespace" {
			if r, ok := router.GetRoute(cookie.Value); ok {
				route = r
			}
		}
	}
	if route.Host == "" {
		route = router.GetRandomRoute()
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
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	go rpc.Serve()
	startServer()
}
