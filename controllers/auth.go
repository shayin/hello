package controllers

import (
	"github.com/astaxie/beego"
	"github.com/shayin/hello/constant"
	"github.com/shayin/hello/models"
	"fmt"
)

type AuthController struct {
	beego.Controller
}

func (c *AuthController) Login() {
	res  := map[string]interface{}{
		"ret": 0,
		"msg": "",
		"data": []interface{}{},
	}
	c.Data["json"] = &res

	username := c.GetString("username")
	pwd := c.GetString("pwd")

	if  username == "" {
		res["msg"] = constant.Login_error_username_empty
		c.ServeJSON()
	}

	if  pwd == "" {
		res["msg"] = constant.Login_error_pwd_empty
		c.ServeJSON()
	}

	user, err := models.CheckAuth(username, pwd)
	fmt.Println(user)
	fmt.Println(err)
	if err != nil {
		res["msg"] = constant.Login_fail
		c.ServeJSON()
	}

	res["ret"] = 1
	res["msg"] = constant.Login_success
	res["data"] = user
	c.ServeJSON()
}