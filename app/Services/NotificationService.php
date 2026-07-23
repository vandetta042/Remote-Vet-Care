<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotification;

class NotificationService
{
    public function notifyUser(int $userId, string $title, string $message): UserNotification
    {
        return UserNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
        ]);
    }

    /**
     * @param  iterable<int>  $userIds
     */
    public function notifyUsers(iterable $userIds, string $title, string $message): void
    {
        $rows = collect($userIds)
            ->unique()
            ->map(fn (int $userId) => [
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->all();

        if ($rows !== []) {
            UserNotification::insert($rows);
        }
    }

    public function notifyRole(string $role, string $title, string $message): void
    {
        $this->notifyUsers(
            User::query()->where('role', $role)->pluck('id'),
            $title,
            $message,
        );
    }
}
