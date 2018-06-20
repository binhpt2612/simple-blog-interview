<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 'lead', 'content','status','slug','updated_at','created_at'
    ];
}
