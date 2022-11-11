import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseOptionalBoolPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value ? value.toLowerCase() === 'true' : undefined;
    } else if (typeof value === 'number') {
      return value > 0;
    }
    return value;
  }
}
