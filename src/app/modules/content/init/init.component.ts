import { Component, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ContentService } from 'src/app/services/content.service';
import { SelectionChange, CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { ContentModel } from 'src/app/models/content.model';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { enableRipple } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { TranslateService } from '@ngx-translate/core';
import { BrandService } from 'src/app/services/brand.service';
import { CompanyService } from 'src/app/services/company.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
enableRipple(true);

/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public item: ContentModel, public level = 1, public expandable = false,
    public isLoading = false) { }
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private cContentService: ContentService) { }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    let oDataSend = {
      masterUserId: localStorage.getItem("AccountId"),
      companyId: node.item.CompanyId,
      contentId: null,
      parentId: node.item.ContentId,
      title: '',
      identifier: '',
      isPublished:null
    };

    node.isLoading = true;
    const index = this.data.indexOf(node);
    if (expand) {
      this.cContentService.ObtenerContenido(oDataSend).subscribe(oContent => {
        const children = oContent;
        if (!children || index < 0) { // If no children, or cannot find the node, no op
          return;
        }
        const nodes = children.map(name => {
          return new DynamicFlatNode(name, node.level + 1, name.HasChild)
        }
        );
        this.data.splice(index + 1, 0, ...nodes);
        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
      })
    } else {
      let count = 0;
      for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++, count++) { }
      this.data.splice(index + 1, count);

      this.dataChange.next(this.data);
      node.isLoading = false;
    }
  }
}

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
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {
  public activeLang = 'es';
  public oModuleSelected = JSON.parse(localStorage.getItem('ModuleSelected')) ? JSON.parse(localStorage.getItem('ModuleSelected')) : {};
  position: string = "below";
  public insertImageSettings = {
    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'
  };
  noData: boolean = true;
  sMasterUserId = localStorage.getItem("AccountId");
  //TREE
  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  //TABLE
  primaryTableLength: number = 0;
  primaryDisplayedColumns: string[] = ['descripcion', 'publicacion', 'fechaupd']
  primaryTableDataSource;
  //FORM
  formCompanyId;
  formBrandId;
  formContentId;
  formParentId;
  formTitle = new FormControl('', [
    Validators.required
  ]);
  formIdentifier = new FormControl('', []);
  formText = new FormControl('', []);
  formIsPublished = new FormControl();
  formMainImage;
  formDateUpd;
  formDateStart;
  formDateEnd;
  formBase64Image = '';
  formExtensionFile = '';

  htmlTitle;
  formIsLink = new FormControl(false);
  flagRestrictControlsToBrand: boolean = true;
  flagDisabledAddButton: boolean = false;
  flagDisabledSaveButton: boolean = false;
  flagDisabledDeleteButton: boolean = false;
  flagShowDeleteButton: boolean = false;
  isLoading: boolean = false;
  selectedImage = null;
  transactionType = 'update';  
  bShowVariables = false;
  constructor(
    private cContentService: ContentService,
    private cBrandService: BrandService,
    private cTranslateService: TranslateService,
    private cSnackbarService: SnackbarService,
    private cCompanyService: CompanyService
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.cContentService);
    this.cTranslateService.setDefaultLang(this.activeLang);
    var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['24px', '48px', '100px', '200px'];
    Quill.register(fontSizeStyle, true);
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.onObtenerCompanias();
  }
  ngAfterViewInit() {
    //ir arriba en la pagina
    let top = document.getElementById('top');
    if (top !== null) { 
      top.scrollIntoView();
      top = null;
    }
  }
  //Obtiene las marcas y las muestra en el treeview
  onObtenerCompanias() {
    let DataSend = {
      masterUserId: this.sMasterUserId,
      companyId: null,
      isActived: true
    };
    this.cCompanyService.MasterCompanyGet(DataSend).subscribe(oDataSend => {
      var companies = JSON.parse(localStorage.getItem("CompanyUser")).OrganizationUsersByCompany;
      var aCompañias = [];
      companies.forEach(element => {
        oDataSend.forEach(c => {
          if (element.CompanyId.toUpperCase() == c.CompanyId.toUpperCase()) {
            c.IsRoot = true; //Setear que es contenido maestro por defecto
            aCompañias.push(c);
          }
        });
      });
      this.dataSource.data = aCompañias.map(name => {
        name.HasChild = true;
        name.Title = name.Name;
        name.ContentId = 0;
        return new DynamicFlatNode(name, 0, name.HasChild);
      });
    });
  }

  onSetData(data) {
    try {
      this.formCompanyId = data.CompanyId;
      this.formBrandId = data.BrandId;
      this.formContentId = data.ContentId;
      this.formParentId = data.ParentId;
      this.formTitle.setValue(data.Title);
      this.formText.setValue(data.Text);
      this.formIdentifier.setValue(data.Identifier);
      this.formIsPublished.setValue(data.IsPublished);
      this.formDateUpd = data.DateUpd.substr(0, 10);
      this.formMainImage = data.MainImage;
      this.formDateStart = data.DateStart;
      this.formDateEnd = data.DateEnd;
      this.htmlTitle = data.Title;
      this.formIsLink.setValue((data.Text.lastIndexOf("<") >= 0 || data.Text === "") ? false : true);
    } catch (error) { }
  }

  reload = null;
  onObtenerContenido(data) {
    this.reload = data;    
    let sParentNodo = this.onOnGetParentNodo(this.reload);
    this.bShowVariables = (sParentNodo.item.Identifier === "PLNTMAIL") ? true : false;

    //Muestra la data en la sección derecha
    this.noData = false
    //Restringe controles de edición a las marcas padre
    if (data.level === 0) {
      this.flagRestrictControlsToBrand = false;
    } else {
      this.flagRestrictControlsToBrand = true;
    }
    //Setea la data para ser mostrada
    let dataAux = data.item;
    this.onSetData(dataAux);
    //Si tiene hijos, no le enseña el botón de eliminar
    debugger;
    // if (dataAux.HasChild !== true) {
    //   this.flagShowDeleteButton = true;
    // } else {
    //   this.flagShowDeleteButton = false;
    // }
    //Si es Root (es contenido base), no se puede eliminar
   
    if(dataAux.IsRoot) this.flagShowDeleteButton = false;
    else this.flagShowDeleteButton = true;
    //Enseña el botón de agregar
    this.flagDisabledAddButton = false;
    this.transactionType = 'update';
    this.primaryTableDataSource = new MatTableDataSource<any>();
    this.primaryTableLength = 0;

    let oDataSend = {
      masterUserId: this.sMasterUserId,
      companyId: this.formCompanyId,
      contentId: null,
      parentId: (this.formContentId === null || 0) ? 0 : this.formContentId,
      title: '',
      isPublished:null
    };

    this.cContentService.ObtenerContenido(oDataSend).subscribe(oContent => {
      this.primaryTableDataSource = new MatTableDataSource<any>(oContent);
      this.primaryTableDataSource.paginator = this.paginator;
      this.primaryTableLength = oContent.length;
    });
  }

  onValidarData() {
    let flat = true;
    if (!this.formTitle.valid) {
      flat = false
    }
    return flat;
  }

  onLimpiarFormulario() {
    this.formTitle.setValue('');
    this.formText.setValue('');
    this.formIdentifier.setValue('');
    this.formIsPublished.setValue(false);
    let formatNewFecha = this.fnConvertDateToString(new Date()) + 'T00:00:00';
    this.formDateStart = formatNewFecha.substr(0, 10);
    this.formDateEnd = formatNewFecha.substr(0, 10);
    this.onRemoverImagen();
    this.flagDisabledAddButton = true;
    this.flagRestrictControlsToBrand = true;
    this.transactionType = 'insert';
  }
  onSelecionarVariable(value) {
    this.formText.setValue(this.formText.value +' '+ value);
  }

  onModificarContenido() {
    if (this.onValidarData()) {
      this.flagDisabledSaveButton = true;
      this.flagDisabledAddButton = true;
      this.flagDisabledDeleteButton = true;
      this.isLoading = true;
      let formTextAux = this.formText.value;
      let regexUrl = /\b(\w*href\w*)\b/
      let bAllHtml = false;
      let sText = this.formText.value;

      if (!this.formIsLink) {
        for (let it in sText) {
          let itN = Number(it);
          if (sText.charAt(itN) === "p" && sText.charAt(itN + 1) === ">" && sText.charAt(itN + 2) !== " " && sText.charAt(itN + 2) !== "<" && sText.charAt(itN + 2) !== "") {
            bAllHtml = true;
            break;
          }
        }

        //expresion que retorna solo el link

        var regFindUrl = new RegExp("(?:^|[\\W])((ht|f)tp(s?):\\/\\/|www\\.)"
          + "(([\\w\\-]+\\.){1,}?([\\w\\-.~]+\\/?)*"
          + "[\\p{Alnum}.,%_=?&#\\-+()\\[\\]\\*$~@!:/{};']*)");

        if (!bAllHtml) {
          //if (regexUrl.test(this.formText.value)) {
          //  let url: any[] = ["'" + this.formText.value + "'"];
          // let formatUrl = url.map(s => {
          //  return /href=(["|'])(.*)\1/.exec(s)[2];
          //});
          // formTextAux = formatUrl[0];
          //}
          if (sText !== null && sText !== "") {
            formTextAux = regFindUrl.exec(sText)[0].substring(1, sText.length);
          }

        }
      }
      //INICIO UPDATE
      if (this.transactionType === 'update') {
        let DataSend = {
          companyId: this.formCompanyId,
          masterUserId: this.sMasterUserId,
          contentId: this.formContentId,
          parentId: this.formParentId,
          title: this.formTitle.value,
          text: formTextAux,
          isPublished: this.formIsPublished.value,
          dateStart: this.formDateStart,
          dateEnd: this.formDateEnd,
          base64Image: this.formBase64Image,
          extensionFile: this.formExtensionFile,
          hasChild: false,
          isRoot: false,
          identifier: this.formIdentifier.value,
          mainImage: (this.formMainImage.split("https://inchcape-agendamiento.s3.us-east-2.amazonaws.com")[1]) ? this.formMainImage.split("https://inchcape-agendamiento.s3.us-east-2.amazonaws.com")[1] : ""
        };
        this.cContentService.ModificarContenido(DataSend).subscribe(oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let sTrans = "ContentInitModifyOkActualizado";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
            this.flagDisabledSaveButton = false;
            this.flagDisabledAddButton = false;
            this.flagDisabledDeleteButton = false;
            this.isLoading = false;
            let sParentNodo = this.onOnGetParentNodo(this.reload);
            this.dataSource.toggleNode(sParentNodo, false);
            this.dataSource.toggleNode(sParentNodo, true);
            this.onLimpiarFormulario()
            this.noData = true;
          } else {
            let sTrans = "ContentInitModifyErrorActualizado";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
            this.flagDisabledSaveButton = false;
            this.flagDisabledAddButton = false;
            this.flagDisabledDeleteButton = false;
            this.isLoading = false;
          }
        });
        //FIN UPDATE
      } else {
        //INICIO INSERT
        let DataSend = {
          companyId: this.formCompanyId,
          masterUserId: this.sMasterUserId,
          // contentId: null,
          parentId: this.formParentId === undefined ? 0 : this.formContentId,
          title: this.formTitle.value,
          text: formTextAux,
          isPublished: this.formIsPublished.value ,
          dateStart: this.formDateStart,
          dateEnd: this.formDateEnd,
          base64Image: this.formBase64Image,//Listo
          extensionFile: this.formExtensionFile,//Listo
          hasChild: false,
          isRoot: false,
          identifier: this.formIdentifier.value,
          mainImage: (this.formMainImage.split("https://inchcape-agendamiento.s3.us-east-2.amazonaws.com")[1]) ? this.formMainImage.split("https://inchcape-agendamiento.s3.us-east-2.amazonaws.com")[1] : ""
        };
        this.cContentService.ModificarContenido(DataSend).subscribe(oRes => {
          let sMessage = '';
          if (oRes.codeResponse) {
            let oDataSend = {
              masterUserId: this.sMasterUserId,
              companyId: this.formCompanyId,
              contentId: null,
              parentId: this.formContentId,
              title: '',
              isPublished:null
            };
            this.cContentService.ObtenerContenido(oDataSend).subscribe(oContent => {
              this.primaryTableDataSource = new MatTableDataSource<any>(oContent);
              this.primaryTableDataSource.paginator = this.paginator;
              this.primaryTableLength = oContent.length;
            });

            let sTrans = "ContentInitModifyOkRegistro";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
            this.flagDisabledSaveButton = false;
            this.flagDisabledAddButton = false;
            this.flagDisabledDeleteButton = false;
            this.isLoading = false;
            let sParentNodo = this.onOnGetParentNodo(this.reload);
            this.dataSource.toggleNode(sParentNodo, false);
            this.dataSource.toggleNode(sParentNodo, true);
            this.onLimpiarFormulario()
            this.noData = true;
          } else {
            let sTrans = "ContentInitModifyErrorRegistro";
            this.cTranslateService.get(sTrans).subscribe((text: string) => {
              sMessage = text;
            });
            this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
            this.flagDisabledSaveButton = false;
            this.flagDisabledAddButton = false;
            this.flagDisabledDeleteButton = false;
            this.isLoading = false;
          }
        });
      }
      //FIN INSERT
    } else {
      let sMessage = '';
      let sTrans = "ContentInitErrorMissingFields";
      this.cTranslateService.get(sTrans).subscribe((text: string) => {
        sMessage = text;
      });
      this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
    }
  }

  onBorrarContenido() {
    //Al borrar el contenido debo actualizar
    let staticURL = 'https://inchcape-agendamiento.s3.us-east-2.amazonaws.com';
    let fileName = this.formMainImage;
    let fileNameAux: string
    if (fileName === staticURL) {
      fileNameAux = ''
    } else {
      fileNameAux = fileName.slice((fileName.lastIndexOf("/") - 1 >>> 0) + 2);
    }
    let DataSend = {
      ContentId: this.formContentId,
      ParentId: this.formParentId,
      FileName: fileNameAux
    }
    this.cContentService.BorrarContenido(DataSend).subscribe(oRes => {
      let sMessage = '';
      if (oRes.codeResponse) {
        let sTrans = "ContentInitDeleteOk";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Success');
        this.flagDisabledSaveButton = false;
        this.flagDisabledAddButton = false;
        this.flagDisabledDeleteButton = false;
        this.isLoading = false;
        let sParentNodo = this.onOnGetParentNodo(this.reload);
        this.dataSource.toggleNode(sParentNodo, false);
        this.dataSource.toggleNode(sParentNodo, true);
        this.onLimpiarFormulario()
        this.noData = true;
      } else {
        let sTrans = "ContentInitDeleteError";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
        this.flagDisabledSaveButton = false;
        this.flagDisabledAddButton = false;
        this.isLoading = false;
      }
    });
  }

  onOnGetParentNodo(oNodoChild) {
    let oNodoAux = null;
    if (oNodoChild.item.ParentId !== null) {
      this.dataSource.data.forEach(element => {
        if (element.item.ContentId === oNodoChild.item.ParentId && element.item.CompanyId === oNodoChild.item.CompanyId) {
          oNodoAux = element;
        }
      });
    }
    if (oNodoChild.item.ParentId == undefined) {
      oNodoAux = oNodoChild;
    }
    return oNodoAux;
  }

  selectFile(fileInput: any) {
    if (fileInput.target.files.length !== 0) {
      this.selectedImage = fileInput.target.files[0];
      let nameAux = this.selectedImage.name;
      let sizeAux = this.selectedImage.size;
      if (this.onValidarImagen(nameAux, sizeAux) !== false) {
        this.formExtensionFile = '.' + this.onValidarImagen(nameAux, sizeAux);
        let reader = new FileReader();
        reader.readAsDataURL(this.selectedImage);
        reader.onload = (e: any) => {
          let preview = document.getElementById('previewImage');
          preview.setAttribute("src", String(reader.result));
          let base64: string = e.target.result;
          this.formBase64Image = base64.split(',')[1];
        };
      } else {
        let sMessage = '';
        let sTrans = "ContentInitErrorImage";
        this.cTranslateService.get(sTrans).subscribe((text: string) => {
          sMessage = text;
        });
        this.cSnackbarService.openSnackBar(sMessage, '', 'Error');
      }
    } else {

    }
  }

  onValidarImagen(filename, size) {
    let extension: string = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'bmp' || extension === 'gif') {
      if (size <= 5000000) {
        return extension
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onRemoverImagen() {
    this.formMainImage = '';
    let preview = document.getElementById('previewImage');
    preview.setAttribute("src", "../src/assets/svg/no_image.png");
    this.formBase64Image = '';
    this.formExtensionFile = '';
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DynamicFlatNode) => _nodeData.item === {} as ContentModel;

  fnConvertDateToString(fecha) {
    let d_fecha_full = fecha.toLocaleString('default', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let d_fecha_aux = d_fecha_full.split('/');
    let d_fecha_fin = d_fecha_aux[2] + '-' + d_fecha_aux[1] + '-' + d_fecha_aux[0];
    return d_fecha_fin;
  }

  onIsLink() {

  }
}
