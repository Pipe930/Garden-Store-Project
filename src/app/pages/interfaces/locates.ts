export interface Region {

  idRegion: number;
  name: string;
  code: string;
}

export interface Province {

  idProvince: number;
  name: string;
  idRegion: number;
}

export interface Commune {

  idCommune: number;
  name: string;
  idProvince: number;
}

export interface ListResponseRegion {
  count: number;
  statusCode: number;
  data: Array<Region>
}

export interface ListResponseProvince {
  count: number;
  statusCode: number;
  data: Array<Province>
}

export interface ListResponseCommune {
  count: number;
  statusCode: number;
  data: Array<Commune>
}

export interface ResponseCommune {

  statusCode: number;
  data: Commune;
}

export interface ResponseProvince {

  statusCode: number;
  data: Province;
}

export interface ResponseRegion {

  statusCode: number;
  data: Region;
}
