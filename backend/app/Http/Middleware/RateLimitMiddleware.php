<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;

/**
 * Rate Limiting Middleware
 * Limits API requests to prevent abuse
 */
class RateLimitMiddleware
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle(Request $request, Closure $next)
    {
        $key = $this->getKey($request);
        
        // Allow 100 requests per minute
        if ($this->limiter->tooManyAttempts($key, 100)) {
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
            ], 429);
        }

        $this->limiter->hit($key, 60);

        return $next($request);
    }

    protected function getKey(Request $request)
    {
        return $request->user()
            ? 'rate-limit:' . $request->user()->id
            : 'rate-limit:' . $request->ip();
    }
}
