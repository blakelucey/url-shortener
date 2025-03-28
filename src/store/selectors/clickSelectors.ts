import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust path to your store's RootState type
import { format } from 'date-fns'; // For date formatting, install with: npm install date-fns

// Base selector for all clicks
export const selectAllClicks = (state: RootState) => state.clicks.clicks;

// Select clicks for a specific link
export const selectClicksByLinkId = createSelector(
    [selectAllClicks, (_: RootState, linkId: string) => linkId],
    (clicks, linkId) => clicks.filter(click => click.linkId === linkId)
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
export const selectDeviceTypeDistribution = createSelector(
    [selectAllClicks],
    (clicks) => {
        const distribution: { [deviceType: string]: number } = {};
        clicks.forEach(click => {
            const deviceType = click.deviceType || 'unknown';
            distribution[deviceType] = (distribution[deviceType] || 0) + 1;
        });
        return distribution;
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