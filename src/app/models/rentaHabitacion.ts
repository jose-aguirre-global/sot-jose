export interface RentaHabitacionModel {

    IdHabitacion: number;
    TarifaHabitaciones:number;
    CantidadpersonasExtra:number;
    TarifaPersonasExtra:number;
    TotalTarifaPersonasExtra:number;
    CantidadHorasExtras:number;
    TarifaHorasExtra:number;
    TotalHorasExtra:number;
    CantidadHospedajeExtra:number;
    TotalHospedajeExtra:number;
    EsAPie:boolean;
    AutoMatricula:string;
    AutoMarca:string;
    AutoModelo:string;
    AutoColor:string;
    TipoEstancia:number;
    TipoPago:number;
    TipoTarjeta:number;
    Total:number;
    Subtotal:number;
    Referencia:string;
    NumeroTarjeta:string;
    idEmpleadoInterno:number;
    MotivoConsumo:string;
    MontoTarjetaMixto:number;
    MontoEfectivoMixto:number;
    propina:number;
    credencial:{
        TipoCredencial:number,
        IdentificadorUsuario:string,
        ValorVerificarStr:string,
        ValorVerificarBin?:string,
        Token?: string
    },
    user:string;
}
