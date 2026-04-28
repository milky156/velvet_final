<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectToRoleDashboard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // If Admin lands on any customer page (root or home), send to Admin Panel
            if ($user->role === 'admin' && ($request->is('/') || $request->is('home'))) {
                return redirect()->route('admin.index');
            }
            
            // If Rider lands on any customer page, send to Rider Dashboard
            if ($user->role === 'rider' && ($request->is('/') || $request->is('home'))) {
                return redirect()->route('rider.index');
            }

            // If Customer lands on the public landing, send to User Home
            if (($user->role === 'customer' || !$user->role) && $request->is('/')) {
                return redirect()->route('home');
            }
        }

        return $next($request);
    }
}
