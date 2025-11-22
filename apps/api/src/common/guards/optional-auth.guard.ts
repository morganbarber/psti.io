import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

/**
 * Optional Authentication Guard
 * 
 * This guard validates JWT tokens when present but allows requests to proceed
 * without authentication. This enables endpoints to support both authenticated
 * and anonymous requests.
 * 
 * Behavior:
 * - No token: Request proceeds (anonymous)
 * - Valid token: User is attached to request.user
 * - Invalid token: Request still proceeds (permissive approach)
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        // No token? Allow request to proceed (anonymous)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return true;
        }

        const token = authHeader.substring(7);

        try {
            const user = await this.authService.validateUser(token);
            if (user) {
                request.user = user; // Attach user to request
            }
            return true;
        } catch (error) {
            // Token present but invalid - still allow request (permissive)
            // Anonymous paste creation will be used as fallback
            return true;
        }
    }
}
