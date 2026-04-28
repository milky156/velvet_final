<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->string('area')->nullable()->after('name');
            $table->decimal('fee', 8, 2)->default(0)->after('area');
            $table->string('estimated_time')->nullable()->after('fee');
            $table->boolean('is_active')->default(true)->after('estimated_time');
        });
    }

    public function down(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->dropColumn(['name', 'area', 'fee', 'estimated_time', 'is_active']);
        });
    }
};
