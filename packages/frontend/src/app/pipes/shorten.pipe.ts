import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
	name: "shorten",
})
export class ShortenPipe implements PipeTransform {
	public transform(value: unknown, ...args: unknown[]): unknown {
		const text = `${value}`;
		const length = args[0] ? Number(args[0]) : 70;
		return text.length > length ? `${text.slice(0, length)}…` : text;
	}
}
