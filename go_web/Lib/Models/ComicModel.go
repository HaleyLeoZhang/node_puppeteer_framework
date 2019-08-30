package Models

// 漫画列表

type ComicModel struct {
	ID        string `json:"id"`
	Channel   string `json:"channel"`
	ComicID   string `json:"comic_id"`
	Name      string `json:"name"`
	Pic       string `json:"pic"`
	Intro     string `json:"intro"`
	IsDeleted string `json:"is_deleted"`
	UpdatedAt string `json:"updated_at"`
	CreatedAt string `json:"created_at"`
}
