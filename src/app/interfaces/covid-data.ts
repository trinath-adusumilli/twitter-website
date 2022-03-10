export interface CovidData {
    date: number,
    state: string,
    positive?: number,
    probableCases?: number,
    negative?: number
}

export interface TwitterData {
    key: string,
    value?:number
}