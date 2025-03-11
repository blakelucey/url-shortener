import dbConnect from '../../../lib/dbConnect';
import Click from '../../../models/click';

export async function POST(request) {
    try {
        await dbConnect();
        const { linkId, referrer, ip } = await request.json();
        if (!linkId) {
            return new Response(JSON.stringify({ error: 'linkId is required' }), { status: 400 });
        }

        const click = new Click({ linkId, referrer, ip });
        await click.save();

        return new Response(JSON.stringify({ message: 'Click logged' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

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
        const linkId = searchParams.get('linkId');

        let query = { 'link.userId': userId };
        if (linkId) {
            query.linkId = linkId;
        }

        const clicks = await Click.find(query).populate('linkId');
        return new Response(JSON.stringify(clicks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}