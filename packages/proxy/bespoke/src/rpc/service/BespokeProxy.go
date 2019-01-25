package service

import (
	"../../game"
	"../proto"
	"golang.org/x/net/context"
	"log"
)

type ProxyService struct{}

func (service *ProxyService) RegisterGame(ctx context.Context, req *proto.RegisterGameReq) (*proto.RegisterGameRes, error) {
	router := game.GetRouter()
	router.RegisterRoute(req.Namespace, game.Route{Host: req.Host, Port: req.Port})
	log.Printf("GameServer注册: %v", req)
	return &proto.RegisterGameRes{Result: true}, nil
}
