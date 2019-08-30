package Models

// 漫画章节对应图片列表

type ImageModel struct {
	ID        string `json:"id"`
	PageID    string `json:"page_id"`
	Sequence  string `json:"sequence"`
	Src       string `json:"src"`
	Progress  string `json:"progress"`
	IsDeleted string `json:"is_deleted"`
	UpdatedAt string `json:"updated_at"`
	CreatedAt string `json:"created_at"`
}
