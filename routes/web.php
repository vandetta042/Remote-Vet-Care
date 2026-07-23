<?php

use App\Http\Controllers\Owner\AnimalController;
use App\Http\Controllers\Owner\VeterinaryCaseController;
use App\Http\Controllers\Researcher\KnowledgeSubmissionController;
use App\Http\Controllers\Reviewer\KnowledgeReviewController;
use App\Http\Controllers\Curator\PublishedRuleController;
use App\Http\Controllers\Vet\VeterinaryCaseController as VetVeterinaryCaseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'redirect'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('owner')->name('owner.')->middleware('role:owner')->group(function () {
        Route::get('/', fn () => redirect()->route('owner.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'owner'])->name('dashboard');
        Route::resource('animals', AnimalController::class)->except(['destroy']);
        Route::resource('cases', VeterinaryCaseController::class)
            ->parameters(['cases' => 'veterinaryCase'])
            ->only(['index', 'create', 'store', 'show']);
    });

    Route::prefix('vet')->name('vet.')->middleware('role:vet')->group(function () {
        Route::get('/', fn () => redirect()->route('vet.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'vet'])->name('dashboard');
        Route::get('cases', [VetVeterinaryCaseController::class, 'index'])->name('cases.index');
        Route::get('cases/{veterinaryCase}', [VetVeterinaryCaseController::class, 'show'])->name('cases.show');
        Route::patch('cases/{veterinaryCase}', [VetVeterinaryCaseController::class, 'update'])->name('cases.update');
    });

    Route::prefix('researcher')->name('researcher.')->middleware('role:researcher')->group(function () {
        Route::get('/', fn () => redirect()->route('researcher.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'researcher'])->name('dashboard');
        Route::resource('knowledge-submissions', KnowledgeSubmissionController::class);
        Route::post(
            'knowledge-submissions/{knowledgeSubmission}/submit',
            [KnowledgeSubmissionController::class, 'submit']
        )->name('knowledge-submissions.submit');
    });

    Route::prefix('reviewer')->name('reviewer.')->middleware('role:reviewer')->group(function () {
        Route::get('/', fn () => redirect()->route('reviewer.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'reviewer'])->name('dashboard');
        Route::get('knowledge-reviews', [KnowledgeReviewController::class, 'index'])
            ->name('knowledge-reviews.index');
        Route::get('knowledge-reviews/{knowledgeSubmission}', [KnowledgeReviewController::class, 'show'])
            ->name('knowledge-reviews.show');
        Route::post('knowledge-reviews/{knowledgeSubmission}', [KnowledgeReviewController::class, 'store'])
            ->name('knowledge-reviews.store');
    });

    Route::prefix('curator')->name('curator.')->middleware('role:curator')->group(function () {
        Route::get('/', fn () => redirect()->route('curator.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'curator'])->name('dashboard');
        Route::get('published-rules', [PublishedRuleController::class, 'index'])
            ->name('published-rules.index');
        Route::get('published-rules/{knowledgeSubmission}', [PublishedRuleController::class, 'show'])
            ->name('published-rules.show');
        Route::post('published-rules/{knowledgeSubmission}/publish', [PublishedRuleController::class, 'publish'])
            ->name('published-rules.publish');
    });

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('/', fn () => redirect()->route('admin.dashboard'))->name('home');
        Route::get('/dashboard', [DashboardController::class, 'admin'])->name('dashboard');
    });
});

require __DIR__.'/auth.php';
