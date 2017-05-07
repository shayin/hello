package routers

import (
	"github.com/astaxie/beego"
	"github.com/shayin/hello/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.AutoRouter(&controllers.AuthController{})
}
