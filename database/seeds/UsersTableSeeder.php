<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    
    public function run()
    {
        DB::table("users")->truncate();
        DB::table("users")->insert(
            [
                "name"      => "admin",
                "email"     => "admin@blog.com",
                "password"  => bcrypt(123123123),
                "role"      => 1,
                "status"    => 1,
            ]
        );
        DB::table("users")->insert(
            [
                "name"      => "mod",
                "email"     => "mod@blog.com",
                "password"  => bcrypt(123123123),
                "role"      => 2,
                "status"    => 1,
            ]
        );

    }
}
