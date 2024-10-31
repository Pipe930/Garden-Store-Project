type TypeAddress = {
  idAddress: number;
  addressName: string;
  numDepartment?: string;
  city: string;
  description?: string;
  commune: Commune;
}

export interface Address {


  name: string;
  address: TypeAddress;
  idAddress: number;
  idAddressUser: number;
  idUser: number;
}

interface Commune {
  idCommune: number;
  name: string;
}

export interface CreateAddress{

  name: string;
  addressName: string;
  numDepartment?: string;
  city: string;
  description?: string;
  idCommune: number;
}

export interface ListAddress{

  statusCode: string;
  data: Array<Address>;
}

export interface ResponseAddress{
  statusCode: string;
  data: Address;
}

export const addressObject: Address = {

  name: "",
  address: {
    idAddress: 0,
    addressName: "",
    city: "",
    description: "",
    commune: {
      idCommune: 0,
      name: ""
    }
  },
  idAddress: 0,
  idAddressUser: 0,
  idUser: 0
}
