export interface Region {

  idRegion: string;
  name: string;
  code: string;
}

export interface Province {

  idProvince: string;
  name: string;
  idRegion: string;
}

export interface Commune {

  idCommune: string;
  name: string;
  idProvince: string;
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
