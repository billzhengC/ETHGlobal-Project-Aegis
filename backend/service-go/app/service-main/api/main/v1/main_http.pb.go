// Code generated by protoc-gen-go-http. DO NOT EDIT.
// versions:
// protoc-gen-go-http v2.2.0

package v1

import (
	context "context"
	http "github.com/go-kratos/kratos/v2/transport/http"
	binding "github.com/go-kratos/kratos/v2/transport/http/binding"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the kratos package it is being compiled against.
var _ = new(context.Context)
var _ = binding.EncodeURL

const _ = http.SupportPackageIsVersion1

type MainHTTPServer interface {
	Ping(context.Context, *PingReq) (*PingResp, error)
}

func RegisterMainHTTPServer(s *http.Server, srv MainHTTPServer) {
	r := s.Route("/")
	r.GET("/service/main/v1/ping", _Main_Ping0_HTTP_Handler(srv))
}

func _Main_Ping0_HTTP_Handler(srv MainHTTPServer) func(ctx http.Context) error {
	return func(ctx http.Context) error {
		var in PingReq
		if err := ctx.BindQuery(&in); err != nil {
			return err
		}
		http.SetOperation(ctx, "/main.v1.Main/Ping")
		h := ctx.Middleware(func(ctx context.Context, req interface{}) (interface{}, error) {
			return srv.Ping(ctx, req.(*PingReq))
		})
		out, err := h(ctx, &in)
		if err != nil {
			return err
		}
		reply := out.(*PingResp)
		return ctx.Result(200, reply)
	}
}

type MainHTTPClient interface {
	Ping(ctx context.Context, req *PingReq, opts ...http.CallOption) (rsp *PingResp, err error)
}

type MainHTTPClientImpl struct {
	cc *http.Client
}

func NewMainHTTPClient(client *http.Client) MainHTTPClient {
	return &MainHTTPClientImpl{client}
}

func (c *MainHTTPClientImpl) Ping(ctx context.Context, in *PingReq, opts ...http.CallOption) (*PingResp, error) {
	var out PingResp
	pattern := "/service/main/v1/ping"
	path := binding.EncodeURL(pattern, in, true)
	opts = append(opts, http.Operation("/main.v1.Main/Ping"))
	opts = append(opts, http.PathTemplate(pattern))
	err := c.cc.Invoke(ctx, "GET", path, nil, &out, opts...)
	if err != nil {
		return nil, err
	}
	return &out, err
}
