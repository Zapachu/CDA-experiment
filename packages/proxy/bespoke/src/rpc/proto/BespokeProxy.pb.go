// Code generated by protoc-gen-go. DO NOT EDIT.
// source: BespokeProxy.proto

package proto

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type RegisterGameReq struct {
	Namespace            string   `protobuf:"bytes,1,opt,name=namespace,proto3" json:"namespace,omitempty"`
	RpcPort              string   `protobuf:"bytes,2,opt,name=rpcPort,proto3" json:"rpcPort,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *RegisterGameReq) Reset()         { *m = RegisterGameReq{} }
func (m *RegisterGameReq) String() string { return proto.CompactTextString(m) }
func (*RegisterGameReq) ProtoMessage()    {}
func (*RegisterGameReq) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c68d2351f2d193a, []int{0}
}

func (m *RegisterGameReq) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_RegisterGameReq.Unmarshal(m, b)
}
func (m *RegisterGameReq) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_RegisterGameReq.Marshal(b, m, deterministic)
}
func (m *RegisterGameReq) XXX_Merge(src proto.Message) {
	xxx_messageInfo_RegisterGameReq.Merge(m, src)
}
func (m *RegisterGameReq) XXX_Size() int {
	return xxx_messageInfo_RegisterGameReq.Size(m)
}
func (m *RegisterGameReq) XXX_DiscardUnknown() {
	xxx_messageInfo_RegisterGameReq.DiscardUnknown(m)
}

var xxx_messageInfo_RegisterGameReq proto.InternalMessageInfo

func (m *RegisterGameReq) GetNamespace() string {
	if m != nil {
		return m.Namespace
	}
	return ""
}

func (m *RegisterGameReq) GetRpcPort() string {
	if m != nil {
		return m.RpcPort
	}
	return ""
}

type RegisterGameRes struct {
	Result               bool     `protobuf:"varint,1,opt,name=result,proto3" json:"result,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *RegisterGameRes) Reset()         { *m = RegisterGameRes{} }
func (m *RegisterGameRes) String() string { return proto.CompactTextString(m) }
func (*RegisterGameRes) ProtoMessage()    {}
func (*RegisterGameRes) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c68d2351f2d193a, []int{1}
}

func (m *RegisterGameRes) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_RegisterGameRes.Unmarshal(m, b)
}
func (m *RegisterGameRes) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_RegisterGameRes.Marshal(b, m, deterministic)
}
func (m *RegisterGameRes) XXX_Merge(src proto.Message) {
	xxx_messageInfo_RegisterGameRes.Merge(m, src)
}
func (m *RegisterGameRes) XXX_Size() int {
	return xxx_messageInfo_RegisterGameRes.Size(m)
}
func (m *RegisterGameRes) XXX_DiscardUnknown() {
	xxx_messageInfo_RegisterGameRes.DiscardUnknown(m)
}

var xxx_messageInfo_RegisterGameRes proto.InternalMessageInfo

func (m *RegisterGameRes) GetResult() bool {
	if m != nil {
		return m.Result
	}
	return false
}

func init() {
	proto.RegisterType((*RegisterGameReq)(nil), "proto.registerGameReq")
	proto.RegisterType((*RegisterGameRes)(nil), "proto.registerGameRes")
}

func init() { proto.RegisterFile("BespokeProxy.proto", fileDescriptor_5c68d2351f2d193a) }

var fileDescriptor_5c68d2351f2d193a = []byte{
	// 164 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x12, 0x72, 0x4a, 0x2d, 0x2e,
	0xc8, 0xcf, 0x4e, 0x0d, 0x28, 0xca, 0xaf, 0xa8, 0xd4, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x62,
	0x05, 0x53, 0x4a, 0x9e, 0x5c, 0xfc, 0x45, 0xa9, 0xe9, 0x99, 0xc5, 0x25, 0xa9, 0x45, 0xee, 0x89,
	0xb9, 0xa9, 0x41, 0xa9, 0x85, 0x42, 0x32, 0x5c, 0x9c, 0x79, 0x89, 0xb9, 0xa9, 0xc5, 0x05, 0x89,
	0xc9, 0xa9, 0x12, 0x8c, 0x0a, 0x8c, 0x1a, 0x9c, 0x41, 0x08, 0x01, 0x21, 0x09, 0x2e, 0xf6, 0xa2,
	0x82, 0xe4, 0x80, 0xfc, 0xa2, 0x12, 0x09, 0x26, 0xb0, 0x1c, 0x8c, 0xab, 0xa4, 0x89, 0x6e, 0x54,
	0xb1, 0x90, 0x18, 0x17, 0x5b, 0x51, 0x6a, 0x71, 0x69, 0x4e, 0x09, 0xd8, 0x1c, 0x8e, 0x20, 0x28,
	0xcf, 0x28, 0x80, 0x8b, 0x07, 0xec, 0x96, 0xe0, 0xd4, 0xa2, 0xb2, 0xcc, 0xe4, 0x54, 0x21, 0x07,
	0x2e, 0x1e, 0x64, 0xad, 0x42, 0x62, 0x10, 0x47, 0xea, 0xa1, 0x39, 0x4d, 0x0a, 0xbb, 0x78, 0xb1,
	0x12, 0x43, 0x12, 0x1b, 0x58, 0xc2, 0x18, 0x10, 0x00, 0x00, 0xff, 0xff, 0xb4, 0xe8, 0x3a, 0xde,
	0xeb, 0x00, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// ProxyServiceClient is the client API for ProxyService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type ProxyServiceClient interface {
	RegisterGame(ctx context.Context, in *RegisterGameReq, opts ...grpc.CallOption) (*RegisterGameRes, error)
}

type proxyServiceClient struct {
	cc *grpc.ClientConn
}

func NewProxyServiceClient(cc *grpc.ClientConn) ProxyServiceClient {
	return &proxyServiceClient{cc}
}

func (c *proxyServiceClient) RegisterGame(ctx context.Context, in *RegisterGameReq, opts ...grpc.CallOption) (*RegisterGameRes, error) {
	out := new(RegisterGameRes)
	err := c.cc.Invoke(ctx, "/proto.ProxyService/registerGame", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ProxyServiceServer is the server API for ProxyService service.
type ProxyServiceServer interface {
	RegisterGame(context.Context, *RegisterGameReq) (*RegisterGameRes, error)
}

func RegisterProxyServiceServer(s *grpc.Server, srv ProxyServiceServer) {
	s.RegisterService(&_ProxyService_serviceDesc, srv)
}

func _ProxyService_RegisterGame_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RegisterGameReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ProxyServiceServer).RegisterGame(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/proto.ProxyService/RegisterGame",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ProxyServiceServer).RegisterGame(ctx, req.(*RegisterGameReq))
	}
	return interceptor(ctx, in, info, handler)
}

var _ProxyService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "proto.ProxyService",
	HandlerType: (*ProxyServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "registerGame",
			Handler:    _ProxyService_RegisterGame_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "BespokeProxy.proto",
}
