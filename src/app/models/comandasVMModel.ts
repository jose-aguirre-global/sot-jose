
export interface ComandasVmModel {
    idComanda: number;
    destino?: number,
    idsArticulosComanda: number[];
    credencial: {
        tipoCredencial: number,
        identificadorUsuario: string,
        valorVerificarStr: string,
        valorVerificarBin?: string
    };
    marcarComoCortesia: boolean,
    pagos: any[],
    propina?: {
        valor: number,
        IdTipoTarjeta: number,
        referencia: string,
        NumeroTarjeta:string
    },
    user:string
}
