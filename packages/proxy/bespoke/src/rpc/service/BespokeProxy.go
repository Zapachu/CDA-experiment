package service

import (
	"../../game"
	"../proto"
	"golang.org/x/net/context"
	"google.golang.org/grpc/peer"
	"log"
	"strings"
)

type ProxyService struct{}

func (service *ProxyService) RegisterGame(ctx context.Context, req *proto.RegisterGameReq) (*proto.RegisterGameRes, error) {
	pr, _ := peer.FromContext(ctx)
	addr := strings.Split(pr.Addr.String(), ":")
	route := game.Route{Host: addr[0], Port: req.Port, RpcPort: req.RpcPort}
	router := game.GetRouter()
	router.RegisterRoute(req.Namespace, route)
	log.Printf("GameServer注册: %v", req)
	return &proto.RegisterGameRes{Result: true}, nil
}
