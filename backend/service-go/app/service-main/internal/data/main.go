package data

import (
	"aegis/app/service-main/internal/biz"
)

type mainRepo struct {
	data *Data
}

func NewMainRepo(data *Data) biz.MainRepo {
	return &mainRepo{
		data: data,
	}
}
