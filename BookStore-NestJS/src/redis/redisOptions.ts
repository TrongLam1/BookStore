import { CacheInterceptor, CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Cache } from 'cache-manager';
import { redisStore } from "cache-manager-redis-store";
import { Observable, tap } from "rxjs";

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: configService.get<string>('REDIS_HOST'),
                port: parseInt(configService.get<string>('REDIS_PORT')!),
            }
        });
        return {
            store: () => store
        };
    },
    inject: [ConfigService],
};

export async function clearCacheWithPrefix(cacheManager: Cache, prefix: string) {
    const client = (cacheManager.store as any).getClient();
    const keys = await client.keys(`${prefix}*`);
    if (keys.length > 0) {
        await client.del(keys);
    }
}

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        return next.handle().pipe(
            tap((data) => {
                if (data !== null || data !== undefined) {
                    super.trackBy(context);
                }
            }),
        );
    }
}