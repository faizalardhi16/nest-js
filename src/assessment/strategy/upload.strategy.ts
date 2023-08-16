import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPiper implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        const oneKB = 1000;
        return value.size < oneKB
    }
}