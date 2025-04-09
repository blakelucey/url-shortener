import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { selectTotalClicksByLink, selectAllClicks } from './clickSelectors';

// Base selector for all links
export const selectAllLinks = (state: RootState) => state.links.links;


// Select a link by shortHash
export const selectLinkByShortHash = createSelector(
  [selectAllLinks, (_: RootState, shortHash: string) => shortHash],
  (links, shortHash) => links.find(link => link.shortHash === shortHash)
);

// Links with their click counts
export const selectLinksWithClickCounts = createSelector(
  [selectAllLinks, selectTotalClicksByLink],
  (links, clickCounts) => {
    return links.map(link => ({
      ...link,
      clickCount: clickCounts[link._id] || 0,
    }));
  }
);

// Top links by click count
export const selectTopLinksByClicks = createSelector(
  [selectLinksWithClickCounts],
  (linksWithCounts) => {
    return [...linksWithCounts].sort((a, b) => b.clickCount - a.clickCount);
  }
);

// Helper to parse a timestamp (click.timestamp should be a date string)
function parseTimestamp(timestamp: any): number {
  return new Date(timestamp).getTime();
}

// Combined selector to aggregate channel counts based on clicks from the link collection over the last 6 months.
export const selectChannelsBreakdownFromClicks = createSelector(
  [selectAllLinks, selectAllClicks],
  (links, clicks) => {
    // Define the time window: last 6 months.
    const now = Date.now();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoTime = sixMonthsAgo.getTime();

    // Filter clicks that happened in the last 6 months.
    const recentClicks = clicks.filter(click => {
      const clickTime = parseTimestamp(click.timestamp);
      return clickTime >= sixMonthsAgoTime;
    });

    // Build a map from link ID to its channels for quick lookup.
    // Assume each link has an `_id` and a `channels` property (an array of channel strings).
    const linkMap: Record<string, { channels: string[] }> = {};
    links.forEach(link => {
      // You might want to check if link.channels exists and is an array.
      linkMap[link._id] = { channels: Array.isArray(link.channels) ? link.channels : [] };
    });

    // Aggregate channel counts.
    const channelCounts: Record<string, number> = {};
    recentClicks.forEach(click => {
      // Look up the link that was clicked.
      const link = linkMap[click.linkId];
      if (link && link.channels) {
        link.channels.forEach((channel: string) => {
          channelCounts[channel] = (channelCounts[channel] || 0) + 1;
        });
      }
    });

    // Convert the results into an array sorted by descending count.
    return Object.entries(channelCounts)
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count);
  }
);

// Combined selector to aggregate channel counts based on clicks from the link collection over the last 6 months.
export const selectCampaignBreakdownFromClicks = createSelector(
  [selectAllLinks, selectAllClicks],
  (links, clicks) => {
    // Define the time window: last 6 months.
    const now = Date.now();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoTime = sixMonthsAgo.getTime();

    // Filter clicks that happened in the last 6 months.
    const recentClicks = clicks.filter(click => {
      const clickTime = parseTimestamp(click.timestamp);
      return clickTime >= sixMonthsAgoTime;
    });

    // Build a map from link ID to its channels for quick lookup.
    // Assume each link has an `_id` and a `channels` property (an array of channel strings).
    const linkMap: Record<string, { campaigns: string[] }> = {};
    links.forEach(link => {
      // You might want to check if link.channels exists and is an array.
      linkMap[link._id] = { campaigns: Array.isArray(link.campaigns) ? link.campaigns : [] };
    });

    // Aggregate channel counts.
    const campaignCounts: Record<string, number> = {};
    recentClicks.forEach(click => {
      // Look up the link that was clicked.
      const link = linkMap[click.linkId];
      if (link && link.campaigns) {
        link.campaigns.forEach((campaign: string) => {
          campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1;
        });
      }
    });

    // Convert the results into an array sorted by descending count.
    return Object.entries(campaignCounts)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count);
  }
);