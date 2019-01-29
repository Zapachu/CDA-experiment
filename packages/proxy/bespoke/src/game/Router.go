package game

import (
	"log"
)

type Route struct {
	Host string
	Port string
}

type Router struct {
	routeTable map[string]Route
}

func (router *Router) RegisterRoute(namespace string, route Route) {
	router.routeTable[namespace] = route
}

func (router *Router) GetRandomRoute() Route {
	var route Route
	if len(router.routeTable) == 0 {
		log.Print("GameServer路由表为空")
	} else {
		for _, r := range router.routeTable {
			route = r
			break
		}
	}
	return route
}

func (router *Router) GetRoute(namespace string) (Route, bool) {
	route, ok := router.routeTable[namespace]
	if !ok {
		log.Printf("未找到指定GameServer:%v", namespace)
	}
	return route, ok
}

var router *Router

func GetRouter() *Router {
	if router == nil {
		router = &Router{routeTable: map[string]Route{}}
	}
	return router
}
