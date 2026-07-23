<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_is_redirected_to_owner_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('owner.dashboard', absolute: false));
    }

    public function test_vet_dashboard_requires_vet_role(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);

        $response = $this->actingAs($owner)->get(route('vet.dashboard'));

        $response->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertOk();
    }
}
