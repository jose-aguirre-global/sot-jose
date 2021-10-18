export interface FmdResponse
{
  ok: boolean,
  fmd?: Fmd,
  error?:string,
  raw?:Raw
}

export interface Fmd {
  callbackRet:Number,
  readableRet: string,
  size: number,
  type: string,
  typeCode: number,
  fmd: string
}

export interface Raw {
  Compression: number;
  Data: string;
  Format: Format;
  Header: Header;
  Version: number;
}

export interface Header {
  DeviceId: number;
  DeviceType: number;
  iDataAcquisitionProgress: number;
  uDataType: number;
}

export interface Format {
  iHeight: number;
  iWidth: number;
  iXdpi: number;
  iYdpi: number;
  uBPP: number;
  uDataType: number;
  uImageType: number;
  uPadding: number;
  uPlanes: number;
  uPolarity: number;
  uRGBcolorRepresentation: number;
  uSignificantBpp: number;
}


/////////////////////////////////////////////////////////////////////////////////

export interface EnrollmentResponse {
  status: number,
  success: boolean,
  message: string
}

export interface loginFingerprintResponse {
  status: number;
  success: boolean;
  message: string;
  result: Result;
  footer: boolean;
  errorException?: any;
}

interface Result {
  usuario: Usuario;
  pagos: number[];
  token: string;
}

interface Usuario {
  idUsuario: number;
  Activo: boolean;
  Alias: string;
  Empleados: Empleado[];
}

interface Empleado {
  Id: number;
  nombreCompleto: string;
  Puestos: Puesto[];
}

interface Puesto {
  IdRol: number;
  Roles: Role[];
}

interface Role {
  nombreRol: string;
  permisos: string;
}
