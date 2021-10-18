export interface HabitacionesResponse {
  status: number;
  message: string;
  success: boolean;
  result: ResultHabitaciones[];
  footer: boolean;
  errorException?: any;
}

export interface ResultHabitaciones {
  idHabitacion: number;
  idTipoHabitacion: number;
  nombreTipo: string;
  numeroHabitacion: string;
  datoBase: string;
  detalle: string;
  idEstado: number;
  estadoHabitacion: string;
  esVencida: boolean;
  idEstadoComanda?: any;
  tieneTarjetaV: boolean;
  posicion: number;
  piso: number;
  definition: Definition;
}

export interface Definition {
  copyEstado: string;
  claseCss: string;
  icon: string;
  iconColor: string;
  alertCss: string;
  nombre?: string;
}
