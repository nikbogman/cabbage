import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { throwHttpGraphQLError } from 'apollo-server-core/dist/runHttpQuery';
import { Observable, of, throwError, } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FieldedError } from './error';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                catchError(err => {
                    return of(err)
                }),
                map(err => {
                    if (err instanceof FieldedError)
                        return err.fields;
                    return new FieldedError('unknown', "messafe")
                })
            )
    }
}
