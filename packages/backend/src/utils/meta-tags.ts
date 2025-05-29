import axios from "axios";
import * as cheerio from "cheerio";

export const parseDuration = (duration: string) => {
	// Check if the duration is just a number (assuming it's in seconds)
	if (/^\d+$/.test(duration)) {
		return Number.parseInt(duration, 10); // Return the number as seconds
	}

	// Check if the duration is in the ISO 8601 time format (e.g., T1H25M58S, T25M58S, T58S)
	const iso8601Pattern =
		/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
	const match = iso8601Pattern.exec(duration);

	if (match === null || (!match[1] && !match[2] && !match[3] && !match[4])) {
		return duration;
	}

	const days = Number.parseInt(match[1] || "0", 10); // Days
	const hours = Number.parseInt(match[2] || "0", 10); // Hours
	const minutes = Number.parseInt(match[3] || "0", 10); // Minutes
	const seconds = Number.parseInt(match[4] || "0", 10); // Seconds

	// Convert everything to seconds and return
	return days * 86400 + hours * 3600 + minutes * 60 + seconds;
};

export const getMetaTagsOfUrl = async (url: string) => {
	const response = await axios.get<string>(url);
	const html = response.data;
	const $ = cheerio.load(html);

	const title =
		$("meta[property='og:title']").attr("content") ?? $("title").text();
	const description =
		$("meta[property='og:description']").attr("content") ??
		$("meta[name='description']").attr("content") ??
		null;
	const thumbnail =
		$("meta[property='og:image']").attr("content") ??
		$("meta[name='twitter:image']").attr("content") ??
		null;

	const duration =
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
