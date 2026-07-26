<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOversightPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_user_case_and_knowledge_oversight_pages(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
        ]);

        $this->actingAs($admin)->get(route('admin.users.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.cases.index'))->assertOk();
        $this->actingAs($admin)->get(route('admin.knowledge.index'))->assertOk();
    }

    public function test_non_admin_cannot_access_admin_oversight_pages(): void
    {
        $owner = User::factory()->create([
            'role' => User::ROLE_OWNER,
        ]);

        $this->actingAs($owner)->get(route('admin.users.index'))->assertForbidden();
        $this->actingAs($owner)->get(route('admin.cases.index'))->assertForbidden();
        $this->actingAs($owner)->get(route('admin.knowledge.index'))->assertForbidden();
    }
}
