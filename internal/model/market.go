package model

type Ticker struct {
	Symbol        string  `json:"symbol"`
	Name          string  `json:"name"`
	Price         float64 `json:"price"`
	ChangePercent float64 `json:"changePercent"`
	Change24h     float64 `json:"change24h"`
	Volume24h     float64 `json:"volume24h"`
	MarketCap     float64 `json:"marketCap"`
}

type CandleData struct {
	Time   string  `json:"time"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
}
