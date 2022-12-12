import { Client } from "https://deno.land/x/mysql/mod.ts";
import { connect, Redis } from "https://deno.land/x/redis/mod.ts";
import { everyMinute } from 'https://deno.land/x/deno_cron/cron.ts';
import Logger from "https://deno.land/x/logger/logger.ts";

const logger = new Logger();
await logger.initFileLogger('../log');

let client: Client, redis: Redis;
try {
    client = await new Client().connect({
        hostname: "127.0.0.1",
        username: "root",
        db: "cabbage",
        password: "root",
    });

    redis = await connect({
        hostname: "127.0.0.1",
        port: 6379,
    });
    logger.info('Redis connected');

    const variants: [{
        id: string;
        stock: number;
    }] = await client.query(`SELECT id, stock FROM Variant`);

    for (const variant of variants) {
        const res = await client.query(`
            SELECT i.quantity 
            FROM Variant AS v 
            INNER JOIN Item AS i 
            ON v.id = i.variantId
            WHERE i.variantId = ?
        `, [variant.id]);
        await redis.set(variant.id, variant.stock - (res[0] ? res[0].quantity : 0 ));
    }
} catch (error) {
    logger.error(error);
    Deno.exit(1);
}

everyMinute(async () => {
    try {
        const items: [{ variantId: string, quantity: number }] = await client.query(`SELECT variantId, quantity from Item`);
        const result = await client.query(`DELETE FROM Cart WHERE expiresAt < NOW()`);

        if (result.affectedRows > 0) {
            logger.info(`deleted ${result.affectedRows} from cart`);
            for (const item of items) {
                const qty = await redis.get(item.variantId);
                console.log(qty)
                //await redis.set(item.variantId, parseInt() + item.quantity);
            }
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
})