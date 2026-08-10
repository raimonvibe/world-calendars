import type { MetadataRoute } from "next";
import { CALENDAR_IDS } from "@/lib/calendars";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/convert`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...CALENDAR_IDS.map((calendarId) => ({
      url: `${SITE_URL}/calendar/${calendarId}`,
      lastModified,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
