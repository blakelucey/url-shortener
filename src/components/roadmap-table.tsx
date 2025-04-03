"use client"

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { Icons } from './icons';

interface JiraIssue {
    id: string;
    key: string;
    self: string;
    fields: {
        summary: string;
        created: string;
        updated: string;
        votes: {
            votes: number;
            hasVoted: boolean;
        };
        description?: any;
    };
}

export default function ProductRoadmap() {
    const [issues, setIssues] = useState<JiraIssue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIssues() {
            try {
                const res = await fetch('/api/jira'); // Your GET endpoint
                if (!res.ok) {
                    throw new Error('Failed to fetch roadmap items');
                }
                const data = await res.json();
                // data.issues is an array of Jira issues.
                setIssues(data.issues);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchIssues();
    }, []);

    if (loading) return <p>Loading roadmap...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!issues || issues.length === 0) return <p>No roadmap items found.</p>;

    const handleVote = (issueKey: string) => {
        // TODO: Implement vote functionality (call your POST endpoint)
        console.log('Vote for', issueKey);
    };

    return (
        <div className="w-full">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Product Roadmap</h1>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Issue Key</TableHead>
                                <TableHead>Summary</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead>Votes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map((issue) => (
                                <TableRow key={issue.id} className="group">
                                    <TableCell className="font-medium">{issue.key}</TableCell>
                                    <TableCell>{issue.fields.summary}</TableCell>
                                    <TableCell>
                                        {new Date(issue.fields.created).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(issue.fields.updated).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="relative">
                                        {issue.fields.votes.votes}

                                    </TableCell>
                                    <TableCell className="relative">
                                        <Button
                                            onClick={() => handleVote(issue.key)}
                                            variant="default"
                                        >
                                            <Icons.ArrowUpIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="relative">
                                        <Button
                                            onClick={() => handleVote(issue.key)}
                                            variant="destructive"
                                        >
                                            <Icons.ArrowDownIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}