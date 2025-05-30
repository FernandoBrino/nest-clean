import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env/env";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";
import { DatabaseModule } from "./database/database.module";
import { EnvModule } from "./env/env.module";
import { EventsModule } from "./events/event.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true, //turns env variables avaiable to all modules
    }),
    AuthModule,
    HttpModule,
    DatabaseModule,
    EnvModule,
    EventsModule
  ],
})
export class AppModule { }
