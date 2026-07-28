<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_landing_page_renders_the_welcome_inertia_component(): void
    {
        $response = $this->get('/');

        $response->assertOk();

        preg_match('/data-page="([^"]+)"/', $response->getContent(), $matches);

        $this->assertNotEmpty($matches[1] ?? null);

        $page = json_decode(html_entity_decode($matches[1]), true);

        $this->assertSame('Welcome', $page['component'] ?? null);
        $this->assertTrue($page['props']['canLogin'] ?? false);
        $this->assertTrue($page['props']['canRegister'] ?? false);
    }
}
