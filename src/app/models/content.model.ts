export interface ContentModel {    
    ContentId: number;
    CompanyId : number;
    BrandId : number;
    ParentId : number;
    Title : string;
    Text : string;
    MainImage : string;
    DateAdd : string;
    DateUpd: string;
    IsPublished : boolean;
    DateStart: string;
    DateEnd : string;
    Name : string;
    ImageUrl : string;
    ExternalId: string;
    IsOwner : boolean;
    HasChild: boolean;
}
  