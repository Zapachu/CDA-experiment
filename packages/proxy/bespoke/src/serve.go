package main

import (
	"./game"
	"./rpc"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

type Proxy struct{}

func (proxy *Proxy) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	router := game.GetRouter()
	var route game.Route
	namespace := strings.Split(req.URL.Path+"//", "/")[2]
	if r, ok := router.GetRoute(namespace); ok {
		fmt.Printf("%s %s \n", namespace, req.URL.Path)
		route = r
	} else {
		route = router.GetRandomRoute()
	}
	remoteUrl, _ := url.Parse("http://" + route.Host + ":" + route.Port)
	httputil.NewSingleHostReverseProxy(remoteUrl).ServeHTTP(res, req)
}

func startServer() {
	err := http.ListenAndServe(":4001", &Proxy{})
	if err != nil {
		log.Fatalln("ListenAndServe: ", err)
	}
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	go rpc.Serve()
	startServer()
}
