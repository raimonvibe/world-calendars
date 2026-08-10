import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The month routes and ?year= views are thin, generated variations of the
        // same 18 calendars. Crawling them adds no index value and costs a request
        // each, so point crawlers at the pages in the sitemap instead.
        disallow: ["/calendar/*/*/*", "/*?year="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
