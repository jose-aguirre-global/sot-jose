import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { IndexloginComponent } from './components/login/indexlogin/indexlogin.component';
import { CocinabarComponent } from './components/roomservice/cocinabar/cocinabar.component';
import { CambiohuellaComponent }from './components/cambiohuella/cambiohuella.component'
import { TicketRoomServiceComponent } from './components/roomservice/TicketsImprimir/TicketRoomService.component'
import { TicketRentaComponent } from './components/inicio/ticket-renta/ticket-renta.component';
import { ReporteMantenimientoComponent } from './components/limpieza/reporte-mantenimiento/reporte-mantenimiento.component';
import { ReporteIncidenciasComponent } from './components/cortes/incidencias-turno/reporte-incidencias/reporte-incidencias.component';
import { ReporteContableImprimirComponent } from './components/cortes/reporte-contable/reporte-contable-imprimir/reporte-contable-imprimir.component';
import { ReporteVentasImprimirComponent } from './components/cortes/reporte-ventas/reporte-ventas-imprimir/reporte-ventas-imprimir.component';

const routes: Routes = [
    { path: 'login', component: IndexloginComponent },
    { path: 'hotel', component: InicioComponent },
    { path: 'cocina-bar/:isbar', component: CocinabarComponent },
    { path: 'restablecerContrasena', component:CambiohuellaComponent},
    { path: 'ImprimirTicketRoomService/:idComanda', component:TicketRoomServiceComponent},
    { path: 'ImprimirTicketHabitacion/:idHabitacion/:numeroHabitacion', component:TicketRentaComponent},
    { path: 'ImprimirReporteMantenimiento/:idHabitacion', component:ReporteMantenimientoComponent},
    { path: 'ImprimirReporteIncidencias', component:ReporteIncidenciasComponent},
    { path: 'ImprimirReporteContable', component:ReporteContableImprimirComponent},
    { path: 'ImprimirReporteVentas', component:ReporteVentasImprimirComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

export const AppRouting = RouterModule.forRoot(routes);
