import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { selectTotalClicksByLink } from './clickSelectors';

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