export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  ACTION = 'action'
}

export interface TableColumns {

  header: string;
  fieldName: string;
  dataType: DataType;
}
