package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["title"] = "This is a demo"
	c.Data["content"] = "This is a demo for golang + webpack"
	c.TplName = "index/index.html"
}
