import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust path to your store's RootState type
import { eachDayOfInterval, format } from 'date-fns'; // For date formatting, install with: npm install date-fns
import { parseUserAgent } from '@/lib/parseUserAgent';

// Base selector for all clicks
export const selectAllClicks = (state: RootState) => state.clicks.clicks;
export const selectAllLinks = (state: RootState) => state.links.links;

// Select clicks for a specific link
export const selectClicksByLinkId = createSelector(
  [selectAllClicks, (_: RootState, linkId: string) => linkId],
  (clicks, linkId) => clicks.filter((click: { linkId: any; }) => click.linkId === linkId)
);

// Total clicks per link
export const selectTotalClicksByLink = createSelector(
  [selectAllClicks],
  (clicks) => {
    const clickCounts: { [linkId: string]: number } = {};
    clicks.forEach(click => {
      clickCounts[click.linkId] = (clickCounts[click.linkId] || 0) + 1;
    });
    return clickCounts;
  }
);

export const selectClicksForLinkByDateAndDevice = createSelector(
  [selectAllClicks, (_: any, linkId: string) => linkId],
  (clicks, linkId) => {
    // Calculate the date 3 months ago from now.
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Filter clicks for the given link and within the last 3 months.
    const filteredClicks = clicks.filter(click =>
      click.linkId === linkId && new Date(click.timestamp) >= threeMonthsAgo
    );

    // Aggregate clicks by date into desktop and mobile counts.
    const counts: Record<string, { desktop: number; mobile: number }> = {};
    filteredClicks.forEach(click => {
      const dateKey = format(new Date(click.timestamp), 'yyyy-MM-dd');
      if (!counts[dateKey]) {
        counts[dateKey] = { desktop: 0, mobile: 0 };
      }
      const { deviceType } = parseUserAgent(click.userAgent || '');
      // Count as mobile if deviceType is 'mobile'; otherwise, count as desktop.
      if (deviceType === 'mobile') {
        counts[dateKey].mobile += 1;
      } else {
        counts[dateKey].desktop += 1;
      }
    });

    // Convert the aggregated data into an array sorted by date.
    return Object.entries(counts)
      .map(([date, devices]) => ({ date, ...devices }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
);

// Clicks within a date range
export const selectClicksWithinDateRange = createSelector(
  [selectAllClicks, (_: RootState, startDate: string) => startDate, (_: RootState, endDate: string) => endDate],
  (clicks, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return clicks.filter(click => {
      const clickDate = new Date(click.timestamp);
      return clickDate >= start && clickDate <= end;
    });
  }
);

// Clicks over time (grouped by day)
export const selectClicksOverTime = createSelector(
  [selectAllClicks],
  (clicks) => {
    const clicksByDay: { [day: string]: number } = {};
    clicks.forEach(click => {
      const day = format(new Date(click.timestamp), 'yyyy-MM-dd');
      clicksByDay[day] = (clicksByDay[day] || 0) + 1;
    });
    return Object.entries(clicksByDay)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }
);

// Distribution by device type
export const selectClicksByDeviceType = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: { [deviceType: string]: number } = {};
    clicks.forEach((click) => {
      const { deviceType } = parseUserAgent(click.userAgent || '');
      counts[deviceType] = (counts[deviceType] || 0) + 1;
    });
    return counts;
  }
);

export const selectClicksByDateAndDevice = createSelector(
  [selectAllClicks],
  (clicks) => {
    const data: Record<string, { desktop: number; mobile: number }> = {};

    clicks.forEach((click) => {
      const dateKey = format(new Date(click.timestamp), 'yyyy-MM-dd');
      if (!data[dateKey]) {
        data[dateKey] = { desktop: 0, mobile: 0 };
      }
      const { deviceType } = parseUserAgent(click.userAgent || '');
      // Assume that if deviceType is 'mobile' then count as mobile; otherwise, count as desktop.
      if (deviceType === 'mobile') {
        data[dateKey].mobile += 1;
      } else {
        data[dateKey].desktop += 1;
      }
    });

    // Convert the aggregated object into an array sorted by date.
    return Object.entries(data)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
);

// Clicks by country
export const selectClicksByCountry = createSelector(
  [selectAllClicks],
  (clicks) => {
    const clicksByCountry: { [country: string]: number } = {};
    clicks.forEach(click => {
      const country = click.country || 'unknown';
      clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;
    });
    return clicksByCountry;
  }
);

// Clicks by UTM campaign
export const selectClicksByUtmCampaign = createSelector(
  [selectAllClicks],
  (clicks) => {
    const clicksByCampaign: { [campaign: string]: number } = {};
    clicks.forEach(click => {
      const campaign = click.utm_campaign || 'unknown';
      clicksByCampaign[campaign] = (clicksByCampaign[campaign] || 0) + 1;
    });
    return clicksByCampaign;
  }
);

// Top referrers by click count
export const selectTopReferrers = createSelector(
  [selectAllClicks],
  (clicks) => {
    const referrerCounts: { [referrer: string]: number } = {};
    clicks.forEach(click => {
      const referrer = click.referrer || 'direct';
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });
    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 referrers
  }
);

export const selectAllReferrersWithTime = createSelector(
  [selectAllClicks],
  (clicks) => {
    // We'll store count as well as the min and max timestamps per referrer.
    const referrerData: {
      [referrer: string]: { count: number; minTimestamp: number; maxTimestamp: number, timestamp: number }
    } = {};

    clicks.forEach(click => {
      // Assume click.timestamp is a valid ISO string.
      const ref = click.referrer || 'Direct';
      const ts = new Date(click.timestamp).getTime(); // getTime() returns a number

      if (!referrerData[ref]) {
        referrerData[ref] = { count: 0, minTimestamp: ts, maxTimestamp: ts, timestamp: ts };
      }
      referrerData[ref].count += 1;
      if (ts < referrerData[ref].minTimestamp) {
        referrerData[ref].minTimestamp = ts;
      }
      if (ts > referrerData[ref].maxTimestamp) {
        referrerData[ref].maxTimestamp = ts;
      }
    });

    // Return an array of referrer objects with time information.
    return Object.entries(referrerData)
      .map(([referrer, data]) => ({
        referrer,
        count: data.count,
        minTimestamp: data.minTimestamp,
        maxTimestamp: data.maxTimestamp,
        timestamp: data.timestamp,
      }))
      .sort((a, b) => b.count - a.count)
  }
);

export const selectUniqueClicksByLink = createSelector(
  [selectAllClicks],
  (clicks) => {
    const clickCounts: any = {};
    const clicksByLink: any = {};

    // Group clicks by linkId
    clicks.forEach((click) => {
      if (!click.linkId || !click._id) return; // Skip invalid clicks
      clicksByLink[click.linkId] = clicksByLink[click.linkId] || new Set();
      clicksByLink[click.linkId].add(click._id);
    });

    // Compute counts from the Sets
    Object.keys(clicksByLink).forEach((linkId) => {
      clickCounts[linkId] = clicksByLink[linkId].size;
    });

    return clickCounts; // { [linkId]: numberOfUniqueClicks }
  }
);

// Most popular link: returns an object with linkId and its click count.
export const selectMostPopularLink = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: { [linkId: string]: number } = {};
    clicks.forEach((click) => {
      if (click.linkId) {
        counts[click.linkId] = (counts[click.linkId] || 0) + 1;
      }
    });
    let mostPopular: { linkId: string; count: number } | null = null;
    for (const [linkId, count] of Object.entries(counts)) {
      if (!mostPopular || count > mostPopular.count) {
        mostPopular = { linkId, count };
      }
    }
    return mostPopular;
  }
);

// A broad summary analytics selector: returns total clicks, number of unique links, 
// average clicks per link, and the most popular link.
export const selectUserAnalyticsSummary = createSelector(
  [selectAllClicks, selectAllLinks],
  (clicks, links) => {
    // Total clicks for the user.
    const totalClicks = clicks.length;

    // Count clicks per link.
    const linkCounts: { [linkId: string]: number } = {};
    clicks.forEach((click) => {
      if (click.linkId) {
        linkCounts[click.linkId] = (linkCounts[click.linkId] || 0) + 1;
      }
    });

    // Number of unique links.
    const uniqueLinks = Object.keys(linkCounts).length;

    // Average clicks per link.
    const averageClicksPerLink = uniqueLinks > 0 ? totalClicks / uniqueLinks : 0;

    // Determine the most popular link by count.
    const mostPopular = Object.entries(linkCounts).reduce(
      (prev, [linkId, count]) => (count > prev.count ? { linkId, count } : prev),
      { linkId: '', count: 0 }
    );

    // Look up the link details from the links collection.
    // Here we assume each link has originalUrl and shortUrl.
    // We assert an inline type to tell TypeScript these properties exist.
    const linkDetails = links.find(
      (link) => link._id === mostPopular.linkId
    ) as { originalUrl?: string; shortUrl?: string } | undefined;
    const originalUrl = linkDetails?.originalUrl ?? '';
    const shortUrl = linkDetails?.shortUrl ?? '';

    return {
      totalClicks,
      uniqueLinks,
      averageClicksPerLink,
      mostPopular: {
        ...mostPopular,
        originalUrl: linkDetails?.originalUrl || '',
        shortUrl: linkDetails?.shortUrl || '',
      },
    };
  }
);

// Group clicks by month (e.g., "Mar 2025") for a monthly activity breakdown.
export const selectMonthlyClicks = createSelector(
  [selectAllClicks],
  (clicks) => {
    const monthlyCounts: { [month: string]: number } = {};
    clicks.forEach((click) => {
      const date = new Date(click.timestamp);
      // Format the month as "Mar 2025" (you can adjust the locale or options as needed).
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    return monthlyCounts;
  }
);

// Selector for operating system popularity.
export const selectClicksByOperatingSystem = createSelector(
  [selectAllClicks],
  (clicks) => {
    const osCounts: { [os: string]: number } = {};
    clicks.forEach(click => {
      const { os } = parseUserAgent(click.userAgent || '');
      osCounts[os] = (osCounts[os] || 0) + 1;
    });
    return osCounts;
  }
);

export const selectClicksByOSOverTime = createSelector(
  [
    selectAllClicks,
    (_: any, startDate: string) => new Date(startDate),
    (_: any, __: string, endDate: string) => new Date(endDate)
  ],
  (clicks, startDate, endDate) => {
    // Filter clicks in the specified time range.
    const filtered = clicks.filter(click => {
      const ts = new Date(click.timestamp);
      return ts >= startDate && ts <= endDate;
    });

    // Aggregate click counts by operating system.
    const osCounts: Record<string, number> = {};
    filtered.forEach(click => {
      const { os } = parseUserAgent(click.userAgent || '');
      // Ensure os is lowercased for consistency.
      const key = os.toLowerCase();
      osCounts[key] = (osCounts[key] || 0) + 1;
    });

    // Convert to an array for chart data.
    return Object.entries(osCounts)
      .map(([os, visitors]) => ({ os, visitors }))
      .sort((a, b) => b.visitors - a.visitors);
  }
);

// Selector for browser popularity.
export const selectClicksByBrowser = createSelector(
  [selectAllClicks],
  (clicks) => {
    const browserCounts: { [browser: string]: number } = {};
    clicks.forEach(click => {
      const { browser } = parseUserAgent(click.userAgent || '');
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    });
    return browserCounts;
  }
);

export const selectClicksByBrowserOverTime = createSelector(
  [
    selectAllClicks,
    (_: any, startDate: string) => new Date(startDate),
    (_: any, __: string, endDate: string) => new Date(endDate)
  ],
  (clicks, startDate, endDate) => {
    // Filter clicks in the specified time range.
    const filtered = clicks.filter(click => {
      const ts = new Date(click.timestamp);
      return ts >= startDate && ts <= endDate;
    });

    // Aggregate click counts by browser.
    const browserCounts: Record<string, number> = {};
    filtered.forEach(click => {
      const { browser } = parseUserAgent(click.userAgent || '');
      // Ensure browser is lowercased for consistency.
      const key = browser.toLowerCase();
      browserCounts[key] = (browserCounts[key] || 0) + 1;
    });

    // Convert to array for chart data.
    return Object.entries(browserCounts)
      .map(([browser, visitors]) => ({ browser, visitors }))
      .sort((a, b) => b.visitors - a.visitors);
  }
);

/* ===== Geographic Data Selectors ===== */

// Aggregate counts by country.
export const selectCountryCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const country = click.country || 'Unknown';
      counts[country] = (counts[country] || 0) + 1;
    });
    return counts;
  }
);

// Top country.
export const selectTopCountry = createSelector(
  [selectCountryCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { country: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts by region.
export const selectRegionCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const region = click.region || 'Unknown';
      counts[region] = (counts[region] || 0) + 1;
    });
    return counts;
  }
);

// Top region.
export const selectTopRegion = createSelector(
  [selectRegionCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { region: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts by city.
export const selectCityCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const city = click.city || 'Unknown';
      counts[city] = (counts[city] || 0) + 1;
    });
    return counts;
  }
);

// Top city.
export const selectTopCity = createSelector(
  [selectCityCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { city: sorted[0][0], count: sorted[0][1] };
  }
);

/* ===== UTM Data Selectors ===== */

type UTMField = 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content';

export const selectClicksByUTMComparisonOverTime = createSelector(
  [
    selectAllClicks,
    (_: any, utmField: UTMField, primaryValue: string, comparisonValue: string) => utmField,
    (_: any, utmField: UTMField, primaryValue: string, comparisonValue: string) => primaryValue,
    (_: any, utmField: UTMField, primaryValue: string, comparisonValue: string) => comparisonValue,
  ],
  (clicks, utmField, primaryValue, comparisonValue) => {
    // Calculate the date 3 months ago from now.
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const endDate = new Date(); // Now

    // Filter clicks within the last 3 months that match either value.
    const filtered = clicks.filter(click => {
      const ts = new Date(click.timestamp);
      // Now that utmField is of type UTMField, we assume that the Click type
      // contains these properties. If not, you can cast click as any.
      const value = (click as any)[utmField] || '';
      return ts >= threeMonthsAgo && ts <= endDate && (value === primaryValue || value === comparisonValue);
    });

    // Aggregate clicks by day for both values.
    const data: Record<string, { primary: number; comparison: number }> = {};
    filtered.forEach(click => {
      const ts = new Date(click.timestamp);
      const dateKey = format(ts, 'yyyy-MM-dd');
      if (!data[dateKey]) {
        data[dateKey] = { primary: 0, comparison: 0 };
      }
      const value = (click as any)[utmField] || '';
      if (value === primaryValue) {
        data[dateKey].primary += 1;
      } else if (value === comparisonValue) {
        data[dateKey].comparison += 1;
      }
    });

    // Convert the aggregated object into a sorted array.
    return Object.entries(data)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
);

// Aggregate counts for utm_source.
export const selectUTMSourceCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const source = click.utm_source || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });
    return counts;
  }
);

// Top utm_source.
export const selectTopUTMSource = createSelector(
  [selectUTMSourceCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { utm_source: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts for utm_medium.
export const selectUTMMediumCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const medium = click.utm_medium || 'Unknown';
      counts[medium] = (counts[medium] || 0) + 1;
    });
    return counts;
  }
);

// Top utm_medium.
export const selectTopUTMMedium = createSelector(
  [selectUTMMediumCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { utm_medium: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts for utm_campaign.
export const selectUTMCampaignCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const campaign = click.utm_campaign || 'Unknown';
      counts[campaign] = (counts[campaign] || 0) + 1;
    });
    return counts;
  }
);

// Top utm_campaign.
export const selectTopUTMCampaign = createSelector(
  [selectUTMCampaignCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { utm_campaign: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts for utm_term.
export const selectUTMTermCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const term = click.utm_term || 'Unknown';
      counts[term] = (counts[term] || 0) + 1;
    });
    return counts;
  }
);

// Top utm_term.
export const selectTopUTMTerm = createSelector(
  [selectUTMTermCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { utm_term: sorted[0][0], count: sorted[0][1] };
  }
);

// Aggregate counts for utm_content.
export const selectUTMContentCounts = createSelector(
  [selectAllClicks],
  (clicks) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const content = click.utm_content || 'Unknown';
      counts[content] = (counts[content] || 0) + 1;
    });
    return counts;
  }
);

// Top utm_content.
export const selectTopUTMContent = createSelector(
  [selectUTMContentCounts],
  (counts) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return { utm_content: sorted[0][0], count: sorted[0][1] };
  }
);