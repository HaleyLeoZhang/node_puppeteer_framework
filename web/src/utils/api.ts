import axios from 'axios';

// 使用原有的后端服务地址
const API_HOST = 'http://puppeteer.hlzblog.top';

const api = axios.create({
  baseURL: API_HOST,
  timeout: 3000,
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 显示错误提示
    if (typeof window !== 'undefined') {
      let message = '服务异常，请稍后重试';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = '请求超时，请稍后重试';
      } else if (error.response?.data?.msg) {
        message = error.response.data.msg;
      }
      // 使用原生 alert 提示用户
      alert(message);
    }
    return Promise.reject(error);
  }
);

export const apiComicList = (page: number = 1) => {
  return api.get('/api/comic/list', { params: { page } });
};

export const apiChapterList = (comicId: number) => {
  return api.get('/api/chapter/list', { params: { comic_id: comicId } });
};

export const apiImageList = (chapterId: number) => {
  return api.get('/api/image/list', { params: { chapter_id: chapterId } });
};

export const apiChapterDetail = (chapterId: number) => {
  return api.get('/api/chapter/detail', { params: { id: chapterId } });
};

export default api;
