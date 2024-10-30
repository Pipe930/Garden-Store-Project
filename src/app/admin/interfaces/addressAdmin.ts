
export interface AddressAdmin {

  idAddress: number;
  addressName: string;
  numDepartment: string;
  city: string;
  description: string;
  idCommune: number;
}

export interface ListAddressResponse {
  statusCode: number;
  data: AddressAdmin[];
}

export interface AddressAdminResponse {
  statusCode: number;
  data: AddressAdmin;
}

export interface CreateAddress {

  addressName: string;
  numDepartment: string;
  city: string;
  description: string;
  idCommune: number;
}
