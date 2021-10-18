export interface LoginModel {
    identificadorUsuario?: string;
    valorVerificarStr?: string;
    // valorVerificarBin: string;
    sinValor: boolean;
    tipoCredencial: number;
    token? : string;
}
