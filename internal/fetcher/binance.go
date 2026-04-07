package fetcher

import (
	"fmt"
	"net/http"
	"time"
)

const baseURL = "https://api.binance.com"

var client = &http.Client{Timeout: 10 * time.Second}

func doGet(url string) ([]byte, error) {
	res, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("请求失败：%w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Binance API 返回 %d", res.StatusCode)
	}
}

func FetchTickers() {

}
