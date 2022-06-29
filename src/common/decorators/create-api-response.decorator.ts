import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const CreateApiResponse = (Entity: Type) => {
    return applyDecorators(
        ApiResponse({
            status: 201,
            description: 'create a single record',
            type: Entity,
        }),
    );
};
