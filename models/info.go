package models

import "github.com/astaxie/beego/orm"

type InfoModel struct {
	Id        int
	Phone     string
	Email     string
	UserModel *UserModel `orm:"reverse(one)"`
}

func init() {
	orm.RegisterModel(new(InfoModel))
}

func (i *InfoModel) TableName() string {
	return "test_info"
}

