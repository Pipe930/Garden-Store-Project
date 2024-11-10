import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";

type TagType = {
  idTag: number;
  name: string;
}

export interface Post {
  idPost: number;
  title: string;
  subtitle: string;
  slug: string;
  thumbnail: string;
  published: boolean;
  content: string;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  tags: TagType[];
  idUser: number;
}

export interface CreatePost {

  title: string;
  subtitle: string;
  file: string;
  filename: string;
  typeFormat: string;
  published: boolean;
  content: string;
  tags: TagType[];
  idUser: number;
}

export interface PostResponse {
  statusCode: number;
  data: Post;
}

export const postColumns: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: 'title',
    header: 'Titulo'
  },
  {
    dataType: DataType.STRING,
    fieldName: 'subtitle',
    header: 'Subtitulo'
  },
  {
    dataType: DataType.BOOLEAN,
    fieldName: 'published',
    header: 'Publicado'
  },
  {
    dataType: DataType.ACTION,
    fieldName: 'action',
    header: 'Acciones'
  }
]
