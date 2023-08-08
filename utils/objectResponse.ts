import { Interface } from "readline";

interface IObjectResponse{
    status: 'Success' | 'Failed';
    code: number;
    data: any;
    message: string;
}



export function objectResponse(props: IObjectResponse){
    return{
        meta: {
            status: props.status,
            code: props.code,
            message: props.message
        },
        data: props.data
    }
}