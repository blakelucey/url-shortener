import dbConnect from '@/lib/dbConnect';
import User from '../../../../models/users';

export const runtime = 'nodejs';   // 15-min limit on Vercel Pro/Enterprise

export async function GET() {
    await dbConnect();// ensure mongoose is ready

    // midnight UTC today
    const cutoff = new Date();
    cutoff.setUTCHours(0, 0, 0, 0);

    console.log('cutoff', cutoff)

    try {
        // 1️⃣ grab users scheduled for deletion
        const users = await User.find(
            { deletionScheduledAt: { $lte: cutoff } },
            { _id: 1 }                   // projection: we only need the IDs
        ).lean();

        console.log('users', users)

        if (users.length === 0) {
            console.log('No users to delete.');
            return new Response(JSON.stringify({ deleted: 0 }));
        }

        // 2️⃣ blow them away in one shot
        const ids = users.map(u => u._id);
        const { deletedCount } = await User.deleteMany({ _id: { $in: ids } });

        console.log(`Deleted ${deletedCount} users.`);
        return new Response(JSON.stringify({ deleted: deletedCount }));
    } catch (err) {
        console.error('Cron job failed:', err);
        // non-2xx → Vercel marks the run failed so you get alerts
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}