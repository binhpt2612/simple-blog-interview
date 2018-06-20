<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;

class HomeController extends Controller
{
    public function index(){
        $articles = Article::where('status', 1)->paginate(5);
        return view('frontend.home',['articles' => $articles]);
    }
    
    public function detail($slug, $id){
        $article = Article::find($id);
        return view('frontend.article',['article' => $article]);
    }
}
