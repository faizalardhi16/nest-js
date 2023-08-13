
interface Meta{
    code: number;
    status: 'Success' | 'Failed'
    message: string;
}

export interface ResponseInterface {
    meta: Meta;
    data: any;
}