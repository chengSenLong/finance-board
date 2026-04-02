package main

import (
	"embed"
	"io"
	"io/fs"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

var frontendAssets embed.FS

func main() {
	r := gin.Default()

	api := r.Group("/api")
	{
		// 测试接口：返回一个模拟的 BTC 价格
		api.GET("/market/ticker", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"symbol": "BTCUSDT",
				"price":  "65432.10",
			})
		})
	}
	// 2. 处理前端静态文件系统
	// 获取 frontend/dist 子目录的句柄
	dist, err := fs.Sub(frontendAssets, "frontend/dist")
	if err != nil {
		panic("无法加载前端静态资源: " + err.Error())
	}

	// 3. 挂载静态资源
	// 将 /assets 路径映射到打包后的静态文件
	r.StaticFS("/assets", http.FS(dist))

	// 4. SPA 路由回退逻辑 (接管 React Router)
	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path

		// 如果请求的是 api 但不存在，直接返回 404，不返回 HTML
		if strings.HasPrefix(path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API endpoint not found"})
			return
		}

		// 检查是否请求了根目录下的具体文件（如 favicon.ico, vite.svg）
		if file, err := dist.Open(strings.TrimPrefix(path, "/")); err == nil {
			defer file.Close()
			stat, _ := file.Stat()
			http.ServeContent(c.Writer, c.Request, stat.Name(), stat.ModTime(), file.(io.ReadSeeker))
			return
		}

		// 其他所有非 API 且找不到文件的路由，全部返回 index.html 交给 React Router 处理
		indexFile, err := dist.Open("index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "index.html not found")
			return
		}
		defer indexFile.Close()
		stat, _ := indexFile.Stat()
		http.ServeContent(c.Writer, c.Request, stat.Name(), stat.ModTime(), indexFile.(io.ReadSeeker))
	})

	// 启动服务
	r.Run(":8080")
}
