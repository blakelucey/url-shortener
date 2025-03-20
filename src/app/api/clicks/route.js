// src/main/java/com/example/redirectionservice/controller/ClickController.js
import dbConnect from "../../../lib/dbConnect";
import Click from "../../../models/click";
import { verifyToken } from "../../../lib/auth";

// POST: Create a new click.
export async function POST(request) {
    try {
        await dbConnect();
        // Destructure all possible fields from the request body.
        const {
            linkId,
            referrer,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            deviceType,
            browser,
            operatingSystem
        } = await request.json();

        if (!linkId) {
            return new Response(
                JSON.stringify({ error: "linkId is required" }),
                { status: 400 }
            );
        }

        // Capture request headers for analytics.
        const ip =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            request.headers.get("host") ||
            "unknown";
        const userAgent = request.headers.get("User-Agent") || "unknown";

        // Create the click record with all available metadata.
        const click = new Click({
            linkId,
            referrer,
            ip,
            userAgent,
            deviceType,
            browser,
            operatingSystem,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content
        });
        await click.save();

        return new Response(
            JSON.stringify({ message: "Click logged", click }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

// GET: Retrieve clicks, optionally filtered by linkId.
export async function GET(request) {
    try {
        await dbConnect();
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const { searchParams } = new URL(request.url);
        const linkId = searchParams.get('linkId')
        console.log('linkId', linkId)

        const clicks = await Click.findOne({ linkId: linkId });
        console.log('clicks', clicks)
        return new Response(JSON.stringify(clicks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// DELETE: Delete a click record by its ID.
export async function DELETE(request) {
    try {
        await dbConnect();
        // Extract clickId from the query parameters.
        const { searchParams } = new URL(request.url);
        const clickId = searchParams.get("clickId");
        if (!clickId) {
            return new Response(
                JSON.stringify({ error: "clickId is required" }),
                { status: 400 }
            );
        }

        // Verify token for authentication.
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(
                JSON.stringify({ error: "Authentication required" }),
                { status: 401 }
            );
        }
        const decoded = verifyToken(token);

        // Find the click record.
        const click = await Click.findById(clickId);
        if (!click) {
            return new Response(
                JSON.stringify({ error: "Click not found" }),
                { status: 404 }
            );
        }
        // Optionally: Ensure the click belongs to the authenticated user.
        if (click.userId && click.userId.toString() !== decoded.userId) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 403 }
            );
        }

        await Click.findByIdAndDelete(clickId);
        return new Response(
            JSON.stringify({ message: "Click deleted", clickId }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}