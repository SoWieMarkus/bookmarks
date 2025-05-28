import { Pipe, type PipeTransform } from '@angular/core';
import z from 'zod';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  public transform(value: unknown, ...args: unknown[]): unknown {
    const { data, success } = z.number().safeParse(value);
    if (!success) {
      return null;
    }
    const hours = Math.floor(data / 3600);
    const minutes = Math.floor((data % 3600) / 60);
    const seconds = data % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  }

}
