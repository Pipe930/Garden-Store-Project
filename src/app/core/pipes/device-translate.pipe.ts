import { Pipe, PipeTransform } from '@angular/core';
import { DeviceUsedEnum } from '@core/enums/deviceUsed.enum';

@Pipe({
  name: 'deviceTranslate',
  standalone: true
})
export class DeviceTranslatePipe implements PipeTransform {

  transform(value: string): string {

    if(value === DeviceUsedEnum.DESKTOP) return "Escritorio";
    if(value === DeviceUsedEnum.MOBILE) return "Móvil";
    if(value === DeviceUsedEnum.TABLET) return "Tablet";

    return value;
  }

}
