import { Component, OnInit } from '@angular/core';

import { enableRipple } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from 'src/app/services/brand.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
enableRipple(true);
/**
 * Rich Text Editor localization sample
 */

L10n.load({
  'es-ES': {
    'richtexteditor': {
        alignments: "Alineaciones",
        justifyLeft: "Alinear a la izquierda",
        justifyCenter: "Alinear centro",
        justifyRight: "Alinear a la derecha",
        justifyFull: "Alinear Justificar",
        fontName: "Nombre de fuente",
        fontSize: "Tamaño de fuente",
        fontColor: "Color de fuente",
        backgroundColor: "Color de fondo",
        bold: "Negrita",
        italic: "cursiva",
        underline: "Subrayado",
        strikethrough: "Tachado",
        clearFormat: "Borrar formato",
        clearAll: "Borrar todo",
        cut: "Corte",
        copy: "Copiar",
        paste: "Pegar",
        unorderedList: "Lista con viñetas",
        orderedList: "Lista numerada",
        indent: "Aumentar sangría",
        outdent: "Disminuir sangría",
        undo: "Deshacer",
        redo: "Rehacer",
        superscript: "Superíndice",
        subscript: "Subíndice",
        createLink: "Insertar hipervínculo",
        openLink: "Abrir enlace",
        editLink: "Editar enlace",
        removeLink: "Eliminar enlace",
        image: "Insertar imagen",
        replace: "Reemplazar",
        align: "Alinear",
        caption: "Subtítulo de imagen",
        remove: "Eliminar",
        insertLink: "Insertar enlace",
        display: "Display",
        altText: "Texto alternativo",
        dimension: "Cambiar tamaño",
        fullscreen: "Maximizar",
        maximize: "Maximizar",
        minimize: "Minimizar",
        lowerCase: "Minúscula",
        upperCase: "Mayúscula",
        print: "Imprimir",
        formats: "Formatos",
        sourcecode: "Vista de código",
        preview: "Vista previa",
        viewside: "Vista lateral",
        insertCode: "Insertar código",
        linkText: "Mostrar texto",
        linkTooltipLabel: "Título",
        linkWebUrl: "Dirección web",
        linkTitle: "Ingrese un título",
        linkurl: "http://ejemplo.com",
        linkOpenInNewWindow: "Abrir enlace en una nueva ventana",
        linkHeader: "Inserta el enlace",
        dialogInsert: "Insertar",
        dialogCancel: "Cancelar",
        dialogUpdate: "Actualizar",
        imageHeader: "Insertar imagen",
        imageLinkHeader: "También puede proporcionar un enlace desde la web",
        mdimageLink: "Proporcione una URL para su imagen",
        imageUploadMessage: "Suelta la imagen aquí o navega para subir",
        imageDeviceUploadMessage: "Haga clic aquí para cargar",
        imageAlternateText: "Texto alternativo",
        alternateHeader: "Texto alternativo",
        browse: "Examinar",
        imageUrl: "http://ejemplo.com/imagen.png",
        imageCaption: "Caption",
        imageSizeHeader: "Tamaño de imagen",
        imageHeight: "Altura",
        imageWidth: "Ancho",
        textPlaceholder: "Ingresar texto",
        inserttablebtn: "Insertar tabla",
        tabledialogHeader: "Insertar tabla",
        tableWidth: "Ancho",
        cellpadding: "Relleno de celda",
        cellspacing: "Espaciado de celda",
        columns: "Número de columnas",
        rows: "Número de filas",
        tableRows: "Filas de tabla",
        tableColumns: "Columnas de tabla",
        tableCellHorizontalAlign: "Alineación horizontal de celda de tabla",
        tableCellVerticalAlign: "Alineación vertical de celda de tabla",
        createTable: "Crear tabla",
        removeTable: "Eliminar tabla",
        tableHeader: "Encabezado de tabla",
        tableRemove: "Eliminar tabla",
        tableCellBackground: "Fondo de celda de tabla",
        tableEditProperties: "Propiedades de edición de tabla",
        styles: "Estilos",
        insertColumnLeft: "Insertar columna a la izquierda",
        insertColumnRight: "Insertar columna derecha",
        deleteColumn: "Eliminar columna",
        insertRowBefore: "Insertar fila antes",
        insertRowAfter: "Insertar fila después",
        deleteRow: "Eliminar fila",
        tableEditHeader: "Editar tabla",
        TableHeadingText: "Encabezado",
        TableColText: "Columna",
        imageInsertLinkHeader: "Insertar enlace",
        editImageHeader: "Editar imagen",
        alignmentsDropDownLeft: "Alinear a la izquierda",
        alignmentsDropDownCenter: "Alinear centro",
        alignmentsDropDownRight: "Alinear a la derecha",
        alignmentsDropDownJustify: "Alinear Justificar",
        imageDisplayDropDownInline: "En línea",
        imageDisplayDropDownBreak: "Rotura",
        tableInsertRowDropDownBefore: "Insertar fila antes",
        tableInsertRowDropDownAfter: "Insertar fila después de",
        tableInsertRowDropDownDelete: "Eliminar fila",
        tableInsertColumnDropDownLeft: "Insertar columna a la izquierda",
        tableInsertColumnDropDownRight: "Insertar columna a la derecha",
        tableInsertColumnDropDownDelete: "Eliminar columna",
        tableVerticalAlignDropDownTop: "Alinear arriba",
        tableVerticalAlignDropDownMiddle: "Alinear Medio",
        tableVerticalAlignDropDownBottom: "Alinear Abajo",
        tableStylesDropDownDashedBorder: "Bordes discontinuos",
        tableStylesDropDownAlternateRows: "Filas alternativas",
        pasteFormat: "Formato de pegado",
        pasteFormatContent: "Elija la acción de formateo",
        plainText: "Texto sin formato",
        cleanFormat: "Limpiar",
        keepFormat: "Mantener"
    }
}
}); 
declare var Quill: any;
@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.css']
})
export class WelcomeMessageComponent implements OnInit {
  private companyUserModel = JSON.parse(localStorage.getItem('CompanyUser'));
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  public oBrandModel ;
  public IsLoadMessage = true;
  private BrandId = "";
  public insertImageSettings = {
    saveUrl : 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'
};
  c_mensaje = new FormControl('', [Validators.required ,]);
  constructor(
    private cTranslateService: TranslateService,
    private cActivatedRoute: ActivatedRoute,
    private cBrandService:BrandService,
    private cSnackbarService:SnackbarService,
    private cRouter: Router
    ) { 
      var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['24px', '48px', '100px', '200px'];
    Quill.register(fontSizeStyle, true);
      this.cTranslateService.setDefaultLang('es');       
      this.BrandId = this.cActivatedRoute.snapshot.params.BrandId;
    }

  ngOnInit() {
    this.onLoadBrand();
  }
  onLoadBrand(){
    this.IsLoadMessage = false;
    let oDataSend = {
      masterUserId: this.companyUserModel.MasterUserId,
      brandId: this.BrandId
    };
    this.cBrandService.BrandsByCompanyGet(oDataSend).subscribe((oData) => { 
      this.oBrandModel = oData[0];
      this.c_mensaje.setValue(this.oBrandModel.WelcomeMessage); 
    },(oErr)=>{
      this.IsLoadMessage = true;

    }, ()=>{

      this.IsLoadMessage = true;
    });
  }
  onSelecionarVariable(value) {
    this.c_mensaje.setValue(this.c_mensaje.value +' '+ value);
  }
  onCancelar() { 
    this.cRouter.navigateByUrl("/home/brand")
  }
  onValidateWelcomeMessage(){ 
    if(!this.c_mensaje.valid){
      let sMessage = '';
      let sTrans = "BrandWelcomeMessageRequire"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      return false;
    }
    return true;
  }
  onGuardarMensaje() {
    if(!this.onValidateWelcomeMessage()){
      return;
    } 
    let oData = {
       companyId: this.oBrandModel.CompanyId,
       brandId : this.oBrandModel.BrandId,
       externalId: this.oBrandModel.ExternalId,
       isOwner: this.oBrandModel.IsOwner,
       isActived: this.oBrandModel.IsActived,
       isDeleted : false,
       domainUrl : this.oBrandModel.DomainUrl,
       imageUrl : this.oBrandModel.ImageUrl, 
       welcomeMessage:  this.c_mensaje.value
    };
    this.cBrandService.BrandsByCompanyModify(oData).subscribe((oData) => { 
      let sMessage = '';
      if (oData.codeResponse) {
        let sTrans = "BrandWelcomeMessageSavedOk"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success'); 
        this.onCancelar();
      } else {
        let sTrans = "BrandWelcomeMessageSavedError"; 
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    },(oErr)=>{

    }, ()=>{

    });
    
  }  
}
