<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Notifications/Index', [
            'notifications' => $request->user()
                ->userNotifications()
                ->latest()
                ->get(),
        ]);
    }

    public function markRead(Request $request, UserNotification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update([
            'read_at' => now(),
        ]);

        return back();
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $request->user()
            ->userNotifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
