export class TajweedInfo{
    surah : number ;
    ayah : number ;
    tajweedRuleOcc : number ; 
}
export enum TajweedRule {
  HamzatWasl = 'hamzat_wasl',
  LamShamsiyyah = 'lam_shamsiyyah',
  Silent = 'silent',
  Ghunnah = 'ghunnah',
  Qalaqah = 'qalaqah',
  Ikhafa = 'ikhafa',
  Madda2 = 'madd_2',
  Madda246 = 'madd_246'
}
export class TajweedAnnotation {
  word: number;       // word index (0-based)
  start: number;      // start index within the word
  end: number;        // end index within the word
  rule: TajweedRule;  // rule type as enum or string
}
export class AyahTajweedData {
  surah :  number;
  ayah : number
  cleanedText: string;                // Full cleaned ayah text
  annotations: TajweedAnnotation[];  // Word-based annotations
}

export class Ayah
{
    number : number;
    text:string;
    isend:boolean;
    text2 : string;
    startwordindex : number;
    wordCount : number;
    annotations?: TajweedAnnotation[] = []; 
}
export class PageLine
  {
    id: number;
    page: number;
    chapter: number;
    linetext: string;
    linenumber: number;
    hizb: number;
    surahname : string;
    linetextnodiacratic: string;
    ayas: Ayah[];
    surahid: number;
  }