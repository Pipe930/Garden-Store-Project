import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";


export interface Employee {

  idEmployee: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  rut: string;
  birthday: Date;
  dateContract: Date;
  salary: number;
  condition: string;
  idBranch: number;
}

export interface ListEmployeesResponse {

  statusCode: number;
  data: Employee[];
}

export interface EmployeeResponse {

  statusCode: number;
  data: Employee;
}

export interface CreateEmployee {

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    rut: string;
    birthdate: Date;
    dateContract: Date;
    salary: number;
    conditions: string;
    idBranch: number;
}

export const columnsEmployee: TableColumns[] = [

  {
    header: "Email",
    dataType: DataType.STRING,
    fieldName: "email"
  },
  {
    header: "Teléfono",
    dataType: DataType.STRING,
    fieldName: "phone"
  },
  {
    header: "Rut",
    dataType: DataType.STRING,
    fieldName: "rut"
  },
  {
    header: "Fecha Contrato",
    dataType: DataType.DATE,
    fieldName: "dateContract"
  },
  {
    header: "Acciones",
    dataType: DataType.ACTION,
    fieldName: "action"
  }
]
