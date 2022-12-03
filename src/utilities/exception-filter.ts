import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { FieldedError } from 'src/utilities/error';

@Catch(FieldedError)
export class FieldedExceptionFilter implements GqlExceptionFilter {
    catch(exception: FieldedError | Error, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        return {
            error:{
                path: gqlHost.getInfo().fieldName,
                issue: exception instanceof FieldedError ? exception.issue: 'unknown',
                message: exception.message
            }
        }
    }
}