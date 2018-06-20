<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Article;
use Illuminate\Support\MessageBag;
use Auth;
class ArticleController extends Controller
{
    public function add( Request $request ){
        $method = $request->method();
        if ($request->isMethod('post')) {
            
            $article_id = $request->input("article_id");
            $validatorData = [
                'title'     => 'required|min:10|uniqueTitle:articles,title,'.$article_id,
                'lead'      => 'required|min:10',
                'content'   => 'required|min:10',
            ];
            
            $validatorMess = [
                'title.required' => "Title không thể bỏ trống",
                'title.min'      => "Title không đủ độ dài",
                'lead.required'  => "Lead không thể bỏ trống",
                'lead.min'       => "Lead không đủ độ dài",
                'content.required'  => "Content không thể bỏ trống",
                'content.min'       => "Content không đủ độ dài",
            ];
            
            $validator = Validator::make($request->all(), $validatorData, $validatorMess);
            
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator);
            }else{
                $title      = $request->input("title");
                $lead       = $request->input("lead");
                $content    = $request->input("content");

                if($article_id > 0){
                    Article::where('id', $article_id)
                      ->update(
                            [
                                'title'     => $title,
                                'lead'      => $lead,
                                'content'   => $content,
                                'slug'      => str_slug($title, "-"),
                                'updated_at'=> date("Y-m-d H:i:s")
                            ]
                        );
                    
                }else{
                    Article::create([
                        'title'     => $title,
                        'lead'      => $lead,
                        'content'   => $content,
                        'slug'      => str_slug($title, "-")
                    ]);    
                }
                return redirect()->route('article.list');
            }
        
        }else{
            return view('admin.article');    
        }
        
    }
    
    public function list( Request $request ){
        $method = $request->method();
        $articles = Article::all();
        return view('admin.list_article', ['articles' => $articles]);
    }
    
    public function edit(Request $request){
        (int) $article_id = $request->article_id;
        $articleDetail = Article::find($article_id);
        return view('admin.article',['article_detail' => $articleDetail]);
    }
    
    public function delete( Request $request ){
        (int) $article_id = $request->article_id;
        Article::destroy($article_id);
        return redirect()->route('article.list');
    }
    
    public function publish(Request $request){
        (int)$article_id = $request->article_id;
        Article::where('id', $article_id)->update(['status' => 1]);
        return redirect()->route('article.list');
    }
    
    public function unPublish(Request $request){
        (int)$article_id = $request->article_id;
        Article::where('id', $article_id)->update(['status' => 0]);
        return redirect()->route('article.list');
    }
    
    public function getDetail( Request $request ){
        (int)$article_id = $request->article_id;
        if($request->ajax()){
            $articleDetail = Article::find($article_id);
            return response()->json($articleDetail->toArray());
        }else{
            return ;
        }
        
        
        
    }
    
}
