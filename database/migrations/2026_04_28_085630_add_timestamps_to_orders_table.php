<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $blueprint) {
            $blueprint->timestamp('picked_up_at')->nullable();
            $blueprint->timestamp('dropped_off_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $blueprint) {
            $blueprint->dropColumn(['picked_up_at', 'dropped_off_at']);
        });
    }
};
