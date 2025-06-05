import axios from "axios";
import * as cheerio from "cheerio";

export const parseDuration = (duration: string) => {
	// If input is just a number in string form
	if (/^\d+$/.test(duration)) {
		return Number.parseInt(duration, 10);
	}

	// Normalize to always have 'PT' for easier parsing
	let iso = duration.startsWith("P") ? duration : `P${duration}`;
	if (!iso.includes("T")) iso = iso.replace("P", "PT");

	// Match ISO 8601 duration (supports hours, minutes, seconds)
	const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
	const match = regex.exec(iso);
	if (!match) {
		return duration;
	}
	const [, h, m, s] = match;
	if (h === undefined && m === undefined && s === undefined) {
		return duration;
	}

	return Number.parseInt(h ?? "0", 10) * 3600 + Number.parseInt(m ?? "0", 10) * 60 + Number.parseInt(s ?? "0", 10);
};

export const getMetaTagsOfUrl = async (url: string) => {
	const response = await axios.get<string>(url);
	const html = response.data;
	const $ = cheerio.load(html);

	const title = $("meta[property='og:title']").attr("content") ?? $("title").text();
	const description =
		$("meta[property='og:description']").attr("content") ?? $("meta[name='description']").attr("content") ?? null;
	const thumbnail =
		$("meta[property='og:image']").attr("content") ?? $("meta[name='twitter:image']").attr("content") ?? null;

	const duration =
		$("meta[property='og:video:duration']").attr("content") ??
		$("meta[property='video:duration']").attr("content") ??
		$("meta[itemprop='duration']").attr("content") ??
		null;

	return {
		title,
		description,
		thumbnail,
		url,
		duration: duration === null ? null : parseDuration(duration),
	};
};
