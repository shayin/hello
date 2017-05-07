package models

import "github.com/astaxie/beego/orm"

type UserModel struct {
	Id        int
	Uid       int
	Name      string
	Pwd       string
	InfoModel *InfoModel `orm:"rel(one)"`
}

func (m *UserModel) TableName() string {
	return "test_user"
}

func init() {
	orm.RegisterModel(new(UserModel))
}

func CheckAuth(username string, pwd string) (user UserModel, err error) {
	o := orm.NewOrm()
	user = UserModel{Name: username, Pwd: pwd}
	err = o.Read(&user, "Name", "Pwd")
	return user, err
}
