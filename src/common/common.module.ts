import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../config/configuration';
import { DataBaseModule } from '../database/database.module';
import { ValidationService } from '../providers/validation.service';
import { ErrorFilter } from './filters/error.filter';
import { EncryptService } from '../providers/encrypt.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        JwtModule.register({
            global: true,
            secret: configuration().secretToken,
            signOptions: {
                expiresIn: '30d'
            }
        }),
        DataBaseModule,
    ],
    providers: [
        ValidationService,
        EncryptService,
        {
            provide: 'EXCEPTION_HANDLER',
            useClass: ErrorFilter
        }
    ],
    exports: [
        ValidationService,
        EncryptService
    ]
})
export class CommonModule { }
