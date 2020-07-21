import { Injectable } from '@angular/core';
import { AgendaModel } from '../models/agenda.model';
import { Observable } from 'rxjs';
import { OpcionesModel } from 'src/app/models/opciones.model';
import { FormControl, Validators } from '@angular/forms';
import { ClienteModel } from '../models/cliente.model';
@Injectable({
  providedIn: 'root'
})
export class AgendarGeneralService {
  isGlobalLoading: boolean = false;
  oAgenda: AgendaModel = {
    oCliente: {} as ClienteModel,
    oUsuario: {},
    c_tipo_servicio: new FormControl(0),
    c_region: new FormControl(''),
    c_taller: new FormControl(''),
    c_kilometraje: new FormControl(''),
    c_asesor: new FormControl(''),
    c_repre_nombre: new FormControl(''),
    c_repre_documento: new FormControl(''),
    c_repre_telefono: new FormControl('',[
      Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    ]),
    c_terminos: new FormControl(false),
    c_repre_desicion: new FormControl(false),
    c_proteciondatos: new FormControl(false),
    c_clie_documento: new FormControl(''),
    c_clie_nombre: new FormControl(''),
    c_clie_apellido: new FormControl(''),
    c_fecha_calendario: new FormControl(new Date()),
    c_tipo_documento : new FormControl(),
    c_documento: new FormControl(),
    aTipoDocumento: [],
    d_fecha: null,
    d_horario: null,
    isRepresentante: null,
    aRegiones: [],
    aKilometraje: [],
    aTiposServicio: [],
    aCanales: [],
    aTalleres: [],
    aAsesores: [],
    aHorario: [],
    sPaso: "1",
    bPasoSegundo: true,
    sButtonEdicion: false,
    sTipoServicio: '------',
    p_i_servicio: 0,
    sKilometraje: '------',
    sRegion: '------',
    p_c_region: '',
    sTaller: '------',
    p_c_taller: '',
    sAsesor: '------',
    p_c_asesor: "",
    sFecha: '------',
    sHora: '------',
    sRepresentante: '------',
    sDNI: '------',
    sRutaActual: "",
    sPreOT: "",
    sAsesorFinal:"",
    sPackage:"",
    c_repre_apellido:new FormControl(),
    c_repre_tipoDoc:new FormControl(),
    c_observaciones:new FormControl(''),
    isPickUpAndDelivery:new FormControl(false),
    sDireccionTaller:""
  } as AgendaModel;
  oOpciones: OpcionesModel = { toogle: false } as OpcionesModel;
  constructor() {
  }
  public fnRestaurarReservaSesion() {
    this.oAgenda = {
      oCliente: {} as ClienteModel,
      oUsuario: {},
      c_tipo_servicio: new FormControl(0),
      c_region: new FormControl(''),
      c_taller: new FormControl(''),
      c_kilometraje: new FormControl(''),
      c_asesor: new FormControl(''),
      c_repre_nombre: new FormControl(''),
      c_repre_documento: new FormControl(''),
      c_repre_telefono: new FormControl('',[
        Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      ]),
      c_terminos: new FormControl(false),
      c_proteciondatos: new FormControl(false),
      c_repre_desicion: new FormControl(false),
      c_clie_documento: new FormControl(''),
      c_clie_nombre: new FormControl(''),
      c_clie_apellido: new FormControl(''),
      c_fecha_calendario: new FormControl(new Date()),
      d_fecha: null,
      d_horario: null,
      isRepresentante: null,
      aRegiones: [],
      aTiposServicio: [],
      aCanales: [],
      aTalleres: [],
      aKilometraje: [],
      aAsesores: [],
      aHorario: [],
      sPaso: "1",
      bPasoSegundo: true,
      sButtonEdicion: false,
      sTipoServicio: '------',
      p_i_servicio: 0,
      sKilometraje: '------',
      sRegion: '------',
      p_c_region: '',
      sTaller: '------',
      p_c_taller: '',
      sAsesor: '------',
      p_c_asesor: "",
      sFecha: '------',
      sHora: '------',
      sRepresentante: '------',
      sDNI: '------',
      sRutaActual: "",
      sPreOT: "",
      c_tipo_documento : new FormControl(),
      c_documento: new FormControl(),
      aTipoDocumento: [],
      sAsesorFinal:"",
      sPackage:"",
      c_repre_apellido:new FormControl(''),
      c_repre_tipoDoc:new FormControl(''),
      c_observaciones:new FormControl(''),
      isPickUpAndDelivery:new FormControl(false),
      sDireccionTaller:""
    } as AgendaModel;
  }
}
