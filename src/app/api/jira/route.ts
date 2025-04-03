import { NextRequest, NextResponse } from 'next/server';

const JIRA_DOMAIN = process.env.NEXT_JIRA_DOMAIN;
const JIRA_EMAIL = process.env.NEXT_JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.NEXT_JIRA_API_TOKEN;

if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    throw new Error("Missing Jira environment variables");
}

const authHeader =
    "Basic " + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

export async function GET(request: NextRequest) {
    // Construct a JQL query to retrieve all roadmap items (adjust as needed)
    const jql = encodeURIComponent('project = MDP ORDER BY created DESC');
    try {
        const response = await fetch(
            `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${jql}`,
            {
                headers: {
                    Authorization: authHeader,
                    Accept: "application/json",
                },
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.errorMessages || "Error fetching issues" },
                { status: response.status }
            );
        }
        const data = await response.json();
        // Return the list of issues as JSON.
        return NextResponse.json(data.issues, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { issueKey, action } = body;
        if (!issueKey || !action) {
            return NextResponse.json(
                { error: "Missing required fields: issueKey and action" },
                { status: 400 }
            );
        }
        let response;
        if (action === "vote") {
            response = await fetch(
                `https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}/vote`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authHeader,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
        } else if (action === "unvote") {
            response = await fetch(
                `https://${JIRA_DOMAIN}/rest/api/3/issue/${issueKey}/vote`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: authHeader,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );
        } else {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.errorMessages || "Error processing vote" },
                { status: response.status }
            );
        }
        return NextResponse.json(
            { message: "Vote processed successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}