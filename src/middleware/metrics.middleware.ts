import { Response, Request, NextFunction } from "express";
import { requestCounter } from "../metrics/requestCount";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
     
    res.on('finish', () => {                         // 'finish' event is emitted when the response has been sent
        const duration = Date.now() - start;
        console.log(`Request took ${duration} ms`);
        
        requestCounter.inc({                        // Increment the request counter
            method: req.method,
            route: req.originalUrl,
            status_code: res.statusCode
        });
    });
    next();
}
