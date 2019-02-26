export const makeGetQuery = (query: any) => {
    return Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&')
}

export interface IIO { }

export class IO {
    log(message: any, ...args: any[]) {
        console.log(message, ...args);
    }

    error(message: any, ...args: any[]) {
        console.error(message, ...args);
    }

    constructor(props?: IIO) { }
}