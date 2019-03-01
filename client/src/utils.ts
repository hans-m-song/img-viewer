export const makeGetQuery = (query: any) => {
    return Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&')
}

export const apiCall = async (endpoint: string, opts?: any): Promise<Response> => {
    if (!opts) opts = {};
    opts = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            ...opts.headers,
        },
        ...opts,
    };
    const contentRegex = new RegExp(opts.headers['content-type'], 'ig');

    const response = await fetch(endpoint, opts);
    
    if (response.status >= 400 || !(contentRegex.test(response.headers.get('content-type') || ''))) {
        const errorBody = {
            error: true,
            status: response.status,
            options: opts,
            body: await response.text(),
        };
        throw new Error(JSON.stringify(errorBody));
    }

    return response;
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