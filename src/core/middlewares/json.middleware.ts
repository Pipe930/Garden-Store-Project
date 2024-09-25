import { Injectable, NestMiddleware, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class JsonMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {

    const contentType = req.headers['content-type'];

    if(!contentType || !contentType.includes('application/json')) throw new UnsupportedMediaTypeException("El servidor solo acepta contenido en formato JSON");
    
    next();
  }
}
