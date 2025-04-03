import dbConnect from '../../../lib/dbConnect';
import User from '@/models/users'
import 'dotenv/config';
import Clicks from '@/models/click';
import { verifyToken } from "../../../lib/auth";
import Link from '../../../models/link';
import UrlMapping from '@/models/urlMapping';


export async function DELETE(request) {
    try {
        await dbConnect();
        const token = request.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return new Response(
                JSON.stringify({ error: "Authentication required" }),
                { status: 401 }
            );
        }
        const decoded = verifyToken(token);
        const userId = decoded.userId;

        // TODO: ensure user is unsubscribed from billing or automatically cancel the user before deleting them...

        // Delete all clicks associated with the given userId
        await Clicks.deleteMany({ userId });

        // Delete all links for the authenticated user
        await Link.deleteMany({ userId });

        // Delete all url mappings for the authenticated user
        await UrlMapping.deleteMany({ userId });

        // Delete the user
        await User.deleteOne({ userId });

        return new Response(
            JSON.stringify({ message: "User and all associated data deleted successfully" }), { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}