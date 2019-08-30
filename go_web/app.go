package main

type book struct {
	title string
	site  string
	title string
	id    int
}

func main() {
	var Book1 Books /* 声明 Book1 为 Books 类型 */
	fmt.Println(Books{"Go 语言", "www.runoob.com", "Go 语言教程", 6495407})
}
