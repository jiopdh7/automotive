import { FormControl } from '@angular/forms';
import { ClienteModel } from './cliente.model';

export interface AgendaModel {
  oUsuario: any,
  oCliente: ClienteModel,
  c_tipo_servicio: FormControl,
  c_region: FormControl,
  c_taller: FormControl,
  c_kilometraje: FormControl,
  c_asesor:FormControl,
  c_repre_nombre:FormControl,
  c_repre_documento:FormControl,
  c_repre_telefono:FormControl,
  c_terminos: FormControl,
  c_proteciondatos: FormControl,
  c_repre_desicion: FormControl,
  c_clie_documento: FormControl,
  c_clie_nombre: FormControl,
  c_clie_apellido: FormControl,
  c_fecha_calendario: FormControl,
  d_fecha: any,
  d_horario: any,
  isRepresentante:boolean,
  aRegiones:any[],
  aTiposServicio:any[],
  aCanales:any[],
  aKilometraje:any[],
  aTalleres:any[],
  aAsesores:any[],
  aHorario:any[],
  sPaso: string;
  bPasoSegundo:boolean;
  sButtonEdicion: boolean;
  sTipoServicio: string;
  p_i_servicio: number;
  sKilometraje: string;
  sRegion: string;
  p_c_region: string;
  sTaller: string;
  p_c_taller: string;
  sAsesor: string;
  p_c_asesor: string;
  sFecha: string;
  sHora: string;
  sRepresentante: string;
  sDNI: string;
  sPreOT: string;
  c_tipo_documento: FormControl;
  c_documento: FormControl;
  aTipoDocumento: any[];
  sAsesorFinal:any;
  sPackage:string;
  c_repre_apellido: FormControl;
  c_repre_tipoDoc: FormControl;
  c_observaciones: FormControl;
  isPickUpAndDelivery:FormControl;
  sDireccionTaller:string;
}
