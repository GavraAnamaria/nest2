import {Injectable, CanActivate, ExecutionContext, createParamDecorator} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from "../enums/role.enum";
import {ROLES_KEY} from "../public/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false; // User is not authenticated
        }


        return requiredRoles.some((role) => user.role === role);
    }
}