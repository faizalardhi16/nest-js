import { IsNotEmpty } from "class-validator";

export class ICreateAssessment{
    @IsNotEmpty()
    title_assessment: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    category_id: number;

    user_id: number;
}

export interface IFindAllAssessment{
    where: Partial<IWhereClause>
}

interface IWhereClause{
    user_id: number;
}