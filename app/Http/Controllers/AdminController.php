<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    
    public function dashbroad(){
        return view('admin.dashbroad');
    }

}
