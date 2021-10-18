
export interface HabitacionesSocketResponse {
  data: string;
  habitaciones: Habitaciones[];
}

interface Habitaciones {
  habitacion: number;
  idUsuario: number;
  alias: string;
}
