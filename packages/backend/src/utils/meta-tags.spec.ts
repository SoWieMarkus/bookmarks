import { parseDuration } from "./meta-tags";

describe("parseDuration", () => {
	it("parses numeric seconds (string)", () => {
		expect(parseDuration("65")).toBe(65);
	});

	it("parses ISO 8601 duration with PT prefix", () => {
		expect(parseDuration("PT3M32S")).toBe(212);
		expect(parseDuration("PT1H2M3S")).toBe(3723);
		expect(parseDuration("PT45S")).toBe(45);
		expect(parseDuration("PT2M")).toBe(120);
	});

	it("parses ISO 8601 duration with T prefix only", () => {
		expect(parseDuration("T38M2S")).toBe(2282);
		expect(parseDuration("T1H2M3S")).toBe(3723);
		expect(parseDuration("T45S")).toBe(45);
		expect(parseDuration("T2M")).toBe(120);
	});

	it("throws on invalid format", () => {
		const invalidValues = ["invalid", "P", "", "Tante", "ptunze", "pt1hfasaefs"];
		for (const value of invalidValues) {
			expect(parseDuration(value)).toBe(value);
		}
	});
});
