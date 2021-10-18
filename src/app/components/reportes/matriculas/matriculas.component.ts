import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';
import { ReporteMatriculaModal } from 'src/app/models/reporteMatricula';
import { MatriculaService } from 'src/app/services/matricula.service';

import { HuellaComponent } from 'src/app/components/huella/huella.component';

declare var $: any;

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {
  loader = false;
  totalCount = 8;

  // Huella Component
  @ViewChild('child_huella') child_huella : HuellaComponent;

  constructor(private matriculaService: MatriculaService) { }

  ngOnInit(): void {

    this.filterMatricula='';
    this.ResetDatosInicioMat();
    this.ResetReporteMatricula();
    this.ResetDatosDescripcion();


    this.userTemp = sessionStorage.user;

  }

  userOptions:boolean=true;
  reporteMatricula:ReporteMatriculaModal;
  variosReportesMatricula=[];
  descripcion='';
  fCreacion='';
  UsuarioInh='';
  estatus='';
  idMatricula='';
  idTipoReporte='';

  filterMatricula: string;
  listaReportes=[];
  matricula:string=''
  infoReporte=[];
  mensajeError:string='';
  reportSelect:any=null;
  eventSeleccionado:any=null;
  todosInhabilitados:boolean=false;
  userTemp:string;
  tipoSeleccionMatricula:string = "";

  sendObject: ReporteMatriculaModal = {
    idMatricula:0,
    matricula: "",
    detalles:"",
    fechaCreacion:"",
    fechaEliminacion:"",
    idUsuarioCreo:"",
    idUsuarioElimino:"",
    nombreUsuarioCreo:"",
    nombreUsuarioElimino:" ",
    activo:true,
    idTipoReporte:'',
    descripcionTipoReporte:''
  }

  ResetDatosInicioMat(){
    // this.filterMatricula='';
    this.matricula='';
    this.variosReportesMatricula=[];
    this.reportSelect=null;
    $("[id*='btninhabilitaRep']").attr('disabled', 'disabled');
    //$('.btn-inhabilitarReporte').removeClass("btn-inhabilitarReporte").addClass("btn-inhabilitarReporte:disabled");
  }

  ResetDatosDescripcion(){
    this.descripcion='';
    this.fCreacion='';
    this.UsuarioInh='';
    this.estatus='';
    this.idMatricula='';
    this.idTipoReporte='';
  }

  ResetReporteMatricula(){

    this.reporteMatricula=
    {
      idMatricula:0,
      matricula:'',
      detalles:'',
      fechaCreacion:'',
      fechaEliminacion:'',
      idUsuarioCreo:'',
      idUsuarioElimino:'',
      nombreUsuarioCreo:'',
      nombreUsuarioElimino:'',
      activo:false,
      idTipoReporte:'',
      descripcionTipoReporte:''
    }
  }

  ObtieneReportesMatricula(matricula:string,userOptions, tipoConsultaMatricula){
    this.tipoSeleccionMatricula = tipoConsultaMatricula;
    this.ResetDatosInicioMat();
    this.ResetDatosDescripcion();
    this.ResetReporteMatricula();

    this.userOptions=userOptions!=undefined ? userOptions:true;
    //validamos el formato de la matricula
    let regMatricula=/^[A-Za-z0-9\s]+$/g;
    let res=regMatricula.test(matricula);
    if (res && matricula.length>5) {

      this.mensajeError='';
      this.matriculaService.GetReportesMatricula(matricula).subscribe((response:any)=>{
        if(response.body.errorException == null){
          this.listaReportes=response.body.result;
          console.log(this.listaReportes);

          if(this.listaReportes.length>0){
            this.loader = false;
            this.OrdenaInfoReporte(response.body.result);
          }
        }
        else{
          if(response.body.errorException.message!=null)
            this.loader = false;
            this.mensajeError='No existen reportes vinculados a esta matrícula';
        }
      });
    }else if(matricula.length==0){
      this.loader = false;
    }else{
      this.loader = true;
      //this.mensajeError='Ingrese una matrícula válida';
    }

  }

  ConfirmacionInhabilitaReporte(){
    $('#InhabilitarMatricula').modal('show');
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
  }

  InhabilitaReporte(){
    if(this.reportSelect!=null && this.reportSelect.activo==true){
      let idMatricula=this.reportSelect.idMatricula;
      this.matriculaService.InhabilitarMatricula(idMatricula, this.userTemp).subscribe((response:any)=>{
        if(response.result==true){
          this.ObtieneReportesMatricula(this.reportSelect.matricula,this.userOptions, '');
          //this.MuestraDetalle(this.reportSelect);
        }
      });
    } else if(this.reportSelect!=null && this.reportSelect.activo==false){
      this.mensajeError='El reporte ya está inhabilitado';
    } else if(this.reportSelect==null){
      this.mensajeError="Seleccione un reporte para inhabilitarlo";
    }
    $('#InhabilitarMatricula').modal('hide');
  }

  OrdenaInfoReporte(reportes :any[]){
    if(reportes.length>0){
      reportes.forEach(el => {
          this.ResetReporteMatricula();
          this.reporteMatricula.idMatricula=el.id,
          this.reporteMatricula.matricula=el.matricula,
          this.reporteMatricula.detalles=el.detalles,
          this.reporteMatricula.fechaCreacion=moment(el.fechaCreacion).format("DD/MM/YYYY-h:mm a"),
          this.reporteMatricula.idUsuarioCreo=el.idUsuarioCreo,
          this.reporteMatricula.idUsuarioElimino=el.idUsuarioElimino,
          this.reporteMatricula.nombreUsuarioCreo=el.nombreUsuarioCreo,
          this.reporteMatricula.nombreUsuarioElimino=el.nombreUsuarioElimino,
          this.reporteMatricula.activo=el.activo;
          this.reporteMatricula.idTipoReporte=el.idTipoReporte;
          this.reporteMatricula.descripcionTipoReporte=el.descripcionTipoReporte;
          this.matricula=el.matricula;
          this.variosReportesMatricula.push(this.reporteMatricula);
      });

      if(!this.userOptions){
        $('#habitacionModal').modal('hide');
        $('#validaMatriculaModal').modal('hide');
        $('.modal-inhabilitaMatricula').modal('show');
        }

    }
    else {
      this.ResetDatosInicioMat();
      this.ResetDatosDescripcion();
      this.ResetReporteMatricula();
      this.mensajeError='Ingrese una matrícula válida';
    }
  }

  MuestraDetalle(reporte:any){

    this.reportSelect=reporte;
    this.ResetDatosDescripcion();
    let cadena = "";
    if(reporte.idTipoReporte == "1"){
      cadena = 'positivo';
    }else if(reporte.idTipoReporte == "2"){
      cadena = 'negativo';
    }else if(reporte.idTipoReporte == "3"){
      cadena = 'neutro';
    }

    this.fCreacion=reporte.fechaCreacion;
    this.descripcion=reporte.detalles;
    this.UsuarioInh='Usuario: '+reporte.nombreUsuarioCreo.toString();
    this.estatus=reporte.activo==true ?'Habilitado-'+cadena : 'Inhabilitado-'+cadena;
    this.idMatricula=reporte.idMatricula;
    this.idTipoReporte=reporte.idTipoReporte;

    if(reporte.activo==true){
      $('#btninhabilitaRep').prop('disabled', false);
    }else{
      $('#btninhabilitaRep').prop('disabled', true);
    }
  }

  ValidarInhabilitados(){
    let count=0;
    let countInhabilitados=0;
    if(this.variosReportesMatricula.length>0){
      count=this.variosReportesMatricula.length;
      if(count!=0){
        this.variosReportesMatricula.forEach(el=>{
          if(el.activo==false){
            countInhabilitados++;
          }
        })
      }
    }else{
      count=this.listaReportes.length;
      if(count!=0){
        this.listaReportes.forEach(el=>{
          if(el.activo==false){
            countInhabilitados++;
          }
        })
      }
    }

    if(count==countInhabilitados){
      this.todosInhabilitados=true;
    }
  }


  SaleInhabilitaRepModal(){

    //sale del modal de inhabilitacion de reportes y debe regresar al modal
    //de renta de habitacion
      this.ResetDatosInicioMat();
      this.ResetDatosDescripcion();
      this.ResetReporteMatricula();

      this.filterMatricula='';
      //validamos la conuslta de matricula
      if(this.tipoSeleccionMatricula == 'normal'){
        $('.modal-inhabilitaMatricula').modal('hide');
      }else{
        if(!this.userOptions){
          this.ValidarInhabilitados();
          if(!this.todosInhabilitados){
            $('.modal-inhabilitaMatricula').modal('hide');
            $('#habitacionModal').modal('show');
            document.querySelector('.modal-backdrop').remove();
          }else{
            $('.modal-inhabilitaMatricula').modal('hide');
            $('#habitacionModal').modal('show');
            document.querySelector('.modal-backdrop').remove();
            $('#reporInhabilitadoModal').modal('show');

            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }
        } else {
          $('.modal-inhabilitaMatricula').modal('hide');
        }
      }

      $('.modal-backdrop').removeClass('show')
      $('.modal-backdrop').modal('hide')
  }

  GuardarReporte(){
    this.mensajeError='';
    let matricula = $('#matricula').val();
    let detalles = $('#detalles').val();
    let radio = $('input[name=flexRadioDefault]:checked').val()
    let idTipoReporte = radio == "true" ? 1:2;

    detalles = detalles.trim();

    if(matricula.length > 5 ){
      if(detalles.length != 0){

        this.loader = false;
        let sendObject2 = {
          matricula: matricula,
          detalles: detalles,
          idTipoReporte: idTipoReporte,
          user: this.userTemp
        };

        this.matriculaService.CrearReportesMatricula(sendObject2).toPromise().then((response: any) => {
          if(response.status == 200){
            let el = response.body;
            this.ResetReporteMatricula();
            this.reporteMatricula.idMatricula = el.id,
            this.reporteMatricula.matricula = el.matricula,
            this.reporteMatricula.detalles = el.detalles,
            this.reporteMatricula.fechaCreacion = moment(el.fechaCreacion).format("DD/MM/YYYY-h:mm a"),
            this.reporteMatricula.idUsuarioCreo = el.idUsuarioCreo,
            this.reporteMatricula.idUsuarioElimino = el.idUsuarioElimino,
            this.reporteMatricula.nombreUsuarioCreo = el.nombreUsuarioCreo,
            this.reporteMatricula.nombreUsuarioElimino = "",
            this.reporteMatricula.activo = el.activo;
            this.reporteMatricula.idTipoReporte=el.idTipoReporte;
            this.reporteMatricula.descripcionTipoReporte=el.descripcionTipoReporte;
            this.matricula = el.matricula;
            this.variosReportesMatricula.push(this.reporteMatricula);
            $('#RegistradoReporteMatriz').modal('show');
            $('#detalles').val('');
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
          }else{
            alert('Fallo');
          }
        });
      }else{
        this.loader = false;
        this.mensajeError='Ingrese una descripcion válida';
      }
    }else{
      this.loader = false;
      this.mensajeError='Ingrese una matrícula válida';
    }
  }

  cerrarModalExitoReporte(){
    $('#RegistradoReporteMatriz').modal('toggle');
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
  }

  cerrarModalInhabilitar(){
    $('#InhabilitarMatriculaExito').modal('toggle');
  }

}
