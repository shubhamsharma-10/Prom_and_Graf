import { Response, Request, NextFunction } from "express";
import { requestCounter } from "../metrics/requestCount";
import { activeRequestsGauge } from "../metrics/activeRequestsGauge";
import { httpRequestDurationMicroseconds } from "../metrics/requestDuration";

// Middleware to track metrics for incoming requests
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
   
    if(req.path !== "/metrics"){
        // Increment the active requests gauge
        activeRequestsGauge.inc();                   
    }

    // 'finish' event is emitted when the response has been sent
    res.on('finish', () => {                         
        const duration = Date.now() - start;
        console.log(`Request took ${duration} ms`);
        
        // Increment the request counter
        requestCounter.inc({                         
            method: req.method,
            route: req.originalUrl,
            status_code: res.statusCode
        });

        // Observe the duration of the request
        httpRequestDurationMicroseconds.observe({  
            method: req.method, 
            route: req.originalUrl, 
            code: res.statusCode 
        }, duration);

        if(req.path !== "/metrics"){
            // Decrement the active requests gauge
            activeRequestsGauge.dec();              
        }

    });

    next();
}
