export interface CovidData {
    date: number,
    state: string,
    positive?: number,
    probableCases?: number,
    negative?: number
}

export interface Test {
    id: string,
    value?:number
}