export interface Comic {
  id: number;
  name: string;
  pic: string;
  intro: string;
  tag: number;
  channel: number;
  supplier: {
    max_sequence: number;
  };
  created_at: string;
}

export interface Chapter {
  id: number;
  comic_id: number;
  name: string;
  sequence: number;
  progress: number;
}

export interface ImageItem {
  id: number;
  chapter_id: number;
  sequence: number;
  src_origin: string;
  src_own: string;
}

export interface ChapterDetail {
  chapter: {
    id: number;
    name: string;
    sequence: number;
  };
  comic: {
    id: number;
    name: string;
  };
  next_chapter: {
    id: number | null;
  };
  prev_chapter: {
    id: number | null;
  };
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}
