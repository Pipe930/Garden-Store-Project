export interface Subcription {

  idSubcription: number;
  created: string;
  status: string;
  mount: number;
  user: string;
}

export interface ResponseSubcription {

  data: Subcription;
  status: string;
}

export interface CreateSubcription{

  mount: number;
}

export const subcriptionObject: Subcription = {

  idSubcription: 0,
  created: "",
  status: "inactivo",
  mount: 0,
  user: ""
}
