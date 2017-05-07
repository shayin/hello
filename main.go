package main

import (
	"github.com/astaxie/beego"
	_ "github.com/go-sql-driver/mysql"
	"github.com/astaxie/beego/orm"
	_ "github.com/shayin/hello/routers"
)

func main() {
	if model := beego.AppConfig.String("runmode"); model == "dev" {
		orm.Debug = true
	}
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", "root:shayin@tcp(localhost:3306)/test_beego?charset=utf8")
	beego.Run()
}
