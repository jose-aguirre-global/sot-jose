import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavMenuComponent } from './components/menus/nav-menu/nav-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReportarMatriculaComponent } from './components/shared/reportar-matricula/reportar-matricula.component';
import { SistemasComponent } from './components/shared/barsmenu/sistemas/sistemas.component';
import { CortesComponent } from './components/shared/barsmenu/cortes/cortes.component';
import { MovimientosComponent } from './components/shared/barsmenu/movimientos/movimientos.component';
import { ClientesComponent } from './components/shared/barsmenu/clientes/clientes.component';
import { FajillasComponent } from './components/shared/barsmenu/sistemas/fajillas/fajillas.component';
import { ConceptoscancelacionComponent } from './components/shared/barsmenu/sistemas/conceptoscancelacion/conceptoscancelacion.component';
import { ConceptosgastosComponent } from './components/shared/barsmenu/sistemas/conceptosgastos/conceptosgastos.component';
import { ImpresorasglobalesComponent } from './components/shared/barsmenu/sistemas/impresorasglobales/impresorasglobales.component';
import { CentrocostosComponent } from './components/shared/barsmenu/sistemas/centrocostos/centrocostos.component';
import { IndexloginComponent } from './components/login/indexlogin/indexlogin.component';
import { RoomListComponent } from './components/roomservice/room-list/room-list.component';
import { CocinabarComponent } from './components/roomservice/cocinabar/cocinabar.component';
import { AutorizarordenComponent } from './components/roomservice/autorizarorden/autorizarorden.component';
import { registerLocaleData ,CommonModule} from '@angular/common';
import localeEsMx from '@angular/common/locales/es-mx';
import { MatriculasComponent } from './components/reportes/matriculas/matriculas.component';
import { HuellaComponent } from './components/huella/huella.component';
import { CambiohuellaComponent } from './components/cambiohuella/cambiohuella.component';
import {TicketRoomServiceComponent} from './components/roomservice/TicketsImprimir/TicketRoomService.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LimpiezaComponent } from './components/limpieza/limpieza.component';
import { TicketRentaComponent } from './components/inicio/ticket-renta/ticket-renta.component';
import { ReporteMantenimientoComponent } from './components/limpieza/reporte-mantenimiento/reporte-mantenimiento.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { OfflineComponent } from './components/offline/offline.component';
import { environment } from 'src/environments/environment';
import { IncidenciasTurnoComponent } from './components/cortes/incidencias-turno/incidencias-turno.component';
import { ControlGastosComponent } from './components/cortes/control-gastos/control-gastos.component';
import { ResumenCorteComponent } from './components/cortes/control-gastos/resumen-corte/resumen-corte.component';
import { ListaCorteComponent } from './components/cortes/control-gastos/resumen-corte/lista-corte/lista-corte.component';
import { RevisionCortesComponent } from './components/cortes/revision-cortes/revision-cortes.component';
import { MenuHamburguesaComponent } from './components/menus/menu-hamburguesa/menu-hamburguesa.component';
import { MenuCortesComponent } from './components/menus/menu-cortes/menu-cortes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReporteVentasComponent } from './components/cortes/reporte-ventas/reporte-ventas.component';
import { ReporteContableComponent } from './components/cortes/reporte-contable/reporte-contable.component';
import { ReportePropinasComponent } from './components/cortes/reporte-propinas/reporte-propinas.component';
import { MenuOperacionesComponent } from './components/menus/menu-operaciones/menu-operaciones.component';
import { DetalleCorteComponent } from './components/cortes/detalle-corte/detalle-corte.component';
import { GestionarRolesComponent } from './components/roles/gestionar-roles/gestionar-roles.component';
import { EditarRolComponent } from './components/roles/gestionar-roles/editar-rol/editar-rol.component';
import { UserMenuComponent } from './components/menus/user-menu/user-menu.component';
import { HorariosPreciosComponent } from './components/operaciones/horarios-precios/horarios-precios.component';
import { AppRouting } from './app.routes';
import { ReporteIncidenciasComponent } from './components/cortes/incidencias-turno/reporte-incidencias/reporte-incidencias.component';
import { ReporteContableImprimirComponent } from './components/cortes/reporte-contable/reporte-contable-imprimir/reporte-contable-imprimir.component';
import { ReporteVentasImprimirComponent } from './components/cortes/reporte-ventas/reporte-ventas-imprimir/reporte-ventas-imprimir.component';
import { ListaPermisosComponent } from './components/roles/gestionar-roles/editar-rol/lista-permisos/lista-permisos.component';
import { MenuFajillasComponent } from './components/menus/menu-fajillas/menu-fajillas.component';
import { RegistroFajillaComponent } from './components/fajillas/registro-fajilla/registro-fajilla.component';
import { ListaFajillaComponent } from './components/fajillas/registro-fajilla/lista-fajilla/lista-fajilla.component';
import { ConsultarFajillasComponent } from './components/fajillas/consultar-fajillas/consultar-fajillas.component';
import { ModalAlertaComponent } from './components/shared/modal-alerta/modal-alerta.component';

const configSockets: SocketIoConfig = { url: environment.socketServer, options: { transports: ['websocket'], upgrade: false } };


registerLocaleData(localeEsMx);

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavMenuComponent,
    UserMenuComponent,
    ReportarMatriculaComponent,
    SistemasComponent,
    CortesComponent,
    MovimientosComponent,
    ClientesComponent,
    FajillasComponent,
    ConceptoscancelacionComponent,
    ConceptosgastosComponent,
    ImpresorasglobalesComponent,
    CentrocostosComponent,
    IndexloginComponent,
    RoomListComponent,
    CocinabarComponent,
    AutorizarordenComponent,
    MatriculasComponent,
    HuellaComponent,
    CambiohuellaComponent,
    TicketRoomServiceComponent,
    LimpiezaComponent,
    TicketRentaComponent,
    ReporteMantenimientoComponent,
    OfflineComponent,
    IncidenciasTurnoComponent,
    RevisionCortesComponent,
    MenuHamburguesaComponent,
    MenuCortesComponent,
    ReporteVentasComponent,
    ReporteContableComponent,
    ReportePropinasComponent,
    MenuOperacionesComponent,
    ControlGastosComponent,
    ResumenCorteComponent,
    ListaCorteComponent,
    DetalleCorteComponent,
    GestionarRolesComponent,
    EditarRolComponent,
    HorariosPreciosComponent,
    ReporteIncidenciasComponent,
    ReporteContableImprimirComponent,
    ReporteVentasImprimirComponent,
    ListaPermisosComponent,
    MenuFajillasComponent,
    RegistroFajillaComponent,
    ListaFajillaComponent,
    ConsultarFajillasComponent,
    ModalAlertaComponent
  ],
  imports: [
    CommonModule,
    AppRouting,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    NgxCurrencyModule,
    SocketIoModule.forRoot(configSockets),
    NgbModule
  ],
  providers: [ {provide: LOCALE_ID, useValue: "es-MX" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
