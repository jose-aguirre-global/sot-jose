export interface HabitacionesModel {
    idHabitacion: number;
    idTipoHabitacion: number;
    nombreTipo: string;
    numeroHabitacion: number;
    datoBase: string;
    detalle: string;
    idEstado: number;
    esVencida: number;
    idEstadoComanda?: boolean;
    tieneTarjetaV: boolean;
    posicion: number;
    piso: number;
    articulos:[];
    totalComandas:number;  
    ComandasRoomServices:[];

    
}
